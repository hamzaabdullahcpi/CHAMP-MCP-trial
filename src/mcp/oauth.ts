/**
 * OAuth 2.1 & RFC 8414 / RFC 9728 Authorization Server for ChatGPT Custom MCP Apps
 *
 * Implements:
 * 1. Protected Resource Metadata (RFC 9728 / draft-ietf-oauth-resource-metadata) at /.well-known/oauth-protected-resource
 * 2. Authorization Server Metadata (RFC 8414) at /.well-known/oauth-authorization-server & /.well-known/openid-configuration
 * 3. Dynamic Client Registration (RFC 7591) at /oauth/register
 * 4. PKCE Authorization Code Grant (RFC 7636, S256) at /oauth/authorize
 * 5. Token Issuance & Refresh at /oauth/token
 * 6. Bearer token validation for MCP endpoints with RFC 9728 WWW-Authenticate header
 * 7. Dual auth: Accepts both OAuth 2.1 access tokens and static MCP_AUTH_TOKEN
 */

import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

export interface RegisteredClient {
  clientId: string;
  clientSecret?: string;
  clientName: string;
  redirectUris: string[];
  grantTypes: string[];
  responseTypes: string[];
  createdAt: number;
}

export interface AuthorizationCode {
  code: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  scope: string;
  expiresAt: number;
}

export interface AccessToken {
  token: string;
  refreshToken: string;
  clientId: string;
  scope: string;
  expiresAt: number;
}

export class OAuthServer {
  private clients: Map<string, RegisteredClient> = new Map();
  private authCodes: Map<string, AuthorizationCode> = new Map();
  private tokens: Map<string, AccessToken> = new Map();
  private refreshTokens: Map<string, AccessToken> = new Map();

  constructor() {
    // Pre-register standard ChatGPT and development clients
    const defaultClients: RegisteredClient[] = [
      {
        clientId: "chatgpt-mcp-client",
        clientName: "ChatGPT Custom MCP App",
        redirectUris: [
          "https://chatgpt.com/api/aip/mcp/callback",
          "https://chatgpt.com/aip/mcp/callback",
          "https://chatgpt.com/aip/plugin/oauth/callback",
          "https://chat.openai.com/aip/mcp/callback",
          "https://chat.openai.com/aip/plugin/oauth/callback",
          "https://chatgpt.com",
          "http://localhost:3000/callback",
          "http://127.0.0.1:3000/callback"
        ],
        grantTypes: ["authorization_code", "refresh_token"],
        responseTypes: ["code"],
        createdAt: Date.now()
      }
    ];

    for (const c of defaultClients) {
      this.clients.set(c.clientId, c);
    }
  }

  /**
   * Derives the public canonical base URL from incoming request headers
   */
  public getBaseUrl(req: Request): string {
    const forwardedProto = req.headers["x-forwarded-proto"];
    const proto =
      (typeof forwardedProto === "string" ? forwardedProto.split(",")[0].trim() : req.protocol) || "https";
    const host = req.headers["x-forwarded-host"] || req.get("host") || "champ-mcp-knowledge-server.onrender.com";
    return `${proto}://${host}`;
  }

  /**
   * 1. Protected Resource Metadata (RFC 9728)
   * Queried by ChatGPT to discover which authorization server protects /mcp
   */
  public getProtectedResourceMetadata(req: Request) {
    const baseUrl = this.getBaseUrl(req);
    return {
      resource: `${baseUrl}/mcp`,
      authorization_servers: [baseUrl],
      scopes_supported: ["openid", "offline_access", "mcp:read", "mcp:tools"],
      bearer_methods_supported: ["header"]
    };
  }

  /**
   * 2. Authorization Server Metadata (RFC 8414 / OpenID Connect Core)
   * Queried by ChatGPT to discover authorize, token, and registration endpoints
   */
  public getAuthorizationServerMetadata(req: Request) {
    const baseUrl = this.getBaseUrl(req);
    return {
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/oauth/authorize`,
      token_endpoint: `${baseUrl}/oauth/token`,
      userinfo_endpoint: `${baseUrl}/oauth/userinfo`,
      registration_endpoint: `${baseUrl}/oauth/register`,
      jwks_uri: `${baseUrl}/oauth/jwks.json`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      code_challenge_methods_supported: ["S256"],
      token_endpoint_auth_methods_supported: ["none", "client_secret_post", "client_secret_basic"],
      scopes_supported: ["openid", "offline_access", "profile", "email", "mcp:read", "mcp:tools"],
      subject_types_supported: ["public"],
      service_documentation: "https://hamzaabdullahcpi.github.io/CHAMP-Toolkit_Island_Meeting/"
    };
  }

  /**
   * Validates redirect URI: Must be HTTPS unless localhost, and match client if registered
   */
  public validateRedirectUri(clientId: string, redirectUri: string): boolean {
    if (!redirectUri) return false;

    let parsed: URL;
    try {
      parsed = new URL(redirectUri);
    } catch {
      return false;
    }

    // RFC 6749 Section 3.1.2.1 / OAuth 2.1: Enforce HTTPS scheme except localhost
    const isLocalhost =
      parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "[::1]";
    if (parsed.protocol !== "https:" && !isLocalhost) {
      return false;
    }

    // Check pre-registered or dynamically registered client
    const client = this.clients.get(clientId);
    if (client && client.redirectUris && client.redirectUris.length > 0) {
      const isRegistered = client.redirectUris.some(
        (u) => redirectUri === u || redirectUri.startsWith(u) || u.startsWith(redirectUri)
      );
      if (isRegistered) return true;
    }

    // Support standard OpenAI / ChatGPT callback origins
    if (parsed.hostname.endsWith("chatgpt.com") || parsed.hostname.endsWith("openai.com") || isLocalhost) {
      return true;
    }

    return false;
  }

  /**
   * 3. Dynamic Client Registration (RFC 7591)
   */
  public registerClient(body: any): RegisteredClient {
    const clientId = `client_${crypto.randomBytes(12).toString("hex")}`;
    const clientSecret = crypto.randomBytes(24).toString("hex");

    const rawRedirectUris = body.redirect_uris || [];
    const redirectUris = Array.isArray(rawRedirectUris) ? rawRedirectUris : [String(rawRedirectUris)];

    const client: RegisteredClient = {
      clientId,
      clientSecret,
      clientName: body.client_name || "ChatGPT Client",
      redirectUris,
      grantTypes: body.grant_types || ["authorization_code", "refresh_token"],
      responseTypes: body.response_types || ["code"],
      createdAt: Date.now()
    };

    this.clients.set(clientId, client);
    return client;
  }

  /**
   * 4. Create Authorization Code (with PKCE)
   */
  public createAuthCode(params: {
    clientId: string;
    redirectUri: string;
    codeChallenge: string;
    codeChallengeMethod?: string;
    scope?: string;
  }): string {
    const code = `code_${crypto.randomBytes(24).toString("hex")}`;
    const authCode: AuthorizationCode = {
      code,
      clientId: params.clientId,
      redirectUri: params.redirectUri,
      codeChallenge: params.codeChallenge,
      codeChallengeMethod: params.codeChallengeMethod || "S256",
      scope: params.scope || "mcp:read mcp:tools",
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    };

    // If client is not yet registered, auto-register it to support flexible ChatGPT client IDs
    if (!this.clients.has(params.clientId)) {
      this.clients.set(params.clientId, {
        clientId: params.clientId,
        clientName: "ChatGPT Custom MCP App",
        redirectUris: [params.redirectUri],
        grantTypes: ["authorization_code", "refresh_token"],
        responseTypes: ["code"],
        createdAt: Date.now()
      });
    }

    this.authCodes.set(code, authCode);
    return code;
  }

  /**
   * PKCE verification helper (RFC 7636)
   */
  public verifyPkce(verifier: string, challenge: string, method: string): boolean {
    if (!verifier || !challenge) return false;
    if (method === "S256") {
      const hash = crypto.createHash("sha256").update(verifier).digest("base64url");
      return hash === challenge;
    }
    if (method === "plain") {
      return verifier === challenge;
    }
    return false;
  }

  /**
   * 5. Exchange Code for Token (RFC 7636)
   */
  public exchangeCodeForToken(params: {
    code: string;
    clientId?: string;
    redirectUri?: string;
    codeVerifier?: string;
  }): { accessToken: string; refreshToken: string; expiresIn: number; scope: string; tokenType: string } {
    const authCode = this.authCodes.get(params.code);
    if (!authCode) {
      throw new Error("Invalid or expired authorization code");
    }

    if (Date.now() > authCode.expiresAt) {
      this.authCodes.delete(params.code);
      throw new Error("Authorization code has expired");
    }

    if (params.clientId && authCode.clientId && authCode.clientId !== params.clientId) {
      throw new Error("Client ID mismatch");
    }

    if (params.redirectUri && authCode.redirectUri !== params.redirectUri) {
      throw new Error("Redirect URI mismatch");
    }

    // Verify PKCE
    if (authCode.codeChallenge) {
      if (!params.codeVerifier) {
        throw new Error("Missing required PKCE code_verifier");
      }
      const isValid = this.verifyPkce(params.codeVerifier, authCode.codeChallenge, authCode.codeChallengeMethod);
      if (!isValid) {
        throw new Error("Invalid PKCE code_verifier");
      }
    }

    // Consume code (one-time use)
    this.authCodes.delete(params.code);

    const accessToken = `champ_at_${crypto.randomBytes(32).toString("hex")}`;
    const refreshToken = `champ_rt_${crypto.randomBytes(32).toString("hex")}`;
    const expiresIn = 3600; // 1 hour

    const tokenEntry: AccessToken = {
      token: accessToken,
      refreshToken,
      clientId: authCode.clientId,
      scope: authCode.scope,
      expiresAt: Date.now() + expiresIn * 1000
    };

    this.tokens.set(accessToken, tokenEntry);
    this.refreshTokens.set(refreshToken, tokenEntry);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      scope: authCode.scope,
      tokenType: "Bearer"
    };
  }

  /**
   * 6. Refresh Token Grant
   */
  public refreshAccessToken(refreshTokenStr: string): {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    scope: string;
    tokenType: string;
  } {
    const existing = this.refreshTokens.get(refreshTokenStr);
    if (!existing) {
      throw new Error("Invalid refresh token");
    }

    // Revoke old tokens
    this.tokens.delete(existing.token);
    this.refreshTokens.delete(refreshTokenStr);

    const newAccessToken = `champ_at_${crypto.randomBytes(32).toString("hex")}`;
    const newRefreshToken = `champ_rt_${crypto.randomBytes(32).toString("hex")}`;
    const expiresIn = 3600;

    const newEntry: AccessToken = {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      clientId: existing.clientId,
      scope: existing.scope,
      expiresAt: Date.now() + expiresIn * 1000
    };

    this.tokens.set(newAccessToken, newEntry);
    this.refreshTokens.set(newRefreshToken, newEntry);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn,
      scope: existing.scope,
      tokenType: "Bearer"
    };
  }

  /**
   * 7. Validate Bearer Token
   * Accepts active OAuth tokens and static MCP_AUTH_TOKEN
   */
  public validateToken(token: string): boolean {
    if (!token) return false;

    // Check if it matches existing static MCP_AUTH_TOKEN
    const staticToken = process.env.MCP_AUTH_TOKEN;
    if (staticToken && token === staticToken) {
      return true;
    }

    // Check OAuth issued tokens
    const entry = this.tokens.get(token);
    if (entry && Date.now() < entry.expiresAt) {
      return true;
    }

    return false;
  }

  /**
   * Render HTML consent page for browser authorization
   */
  public renderConsentHtml(params: {
    clientId: string;
    redirectUri: string;
    state?: string;
    codeChallenge?: string;
    codeChallengeMethod?: string;
    scope?: string;
  }): string {
    const { clientId, redirectUri, state = "", codeChallenge = "", codeChallengeMethod = "S256", scope = "mcp:read mcp:tools" } = params;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authorize ChatGPT — CHAMP Knowledge Assistant</title>
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --border: #334155;
      --primary: #10b981;
      --primary-hover: #059669;
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
    .card { background: var(--card); border: 1px solid var(--border); border-radius: 1rem; max-width: 500px; width: 100%; padding: 2rem; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { text-align: center; margin-bottom: 1.75rem; }
    .badge { display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(16, 185, 129, 0.15); color: var(--primary); padding: 0.35rem 0.85rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; border: 1px solid rgba(16, 185, 129, 0.3); }
    h1 { font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem; color: #fff; }
    .subtitle { color: var(--text-muted); font-size: 0.9rem; line-height: 1.5; }
    .permissions { background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.25rem; margin-bottom: 1.75rem; }
    .perm-title { font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.75rem; }
    .perm-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
    .perm-item { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.875rem; color: #e2e8f0; }
    .perm-icon { color: var(--primary); flex-shrink: 0; font-weight: bold; }
    .client-info { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 1.75rem; text-align: center; word-break: break-all; }
    .actions { display: flex; flex-direction: column; gap: 0.75rem; }
    .btn { width: 100%; padding: 0.85rem; border-radius: 0.5rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; border: none; text-align: center; text-decoration: none; }
    .btn-primary { background: var(--primary); color: #022c22; }
    .btn-primary:hover { background: var(--primary-hover); transform: translateY(-1px); }
    .btn-cancel { background: transparent; color: var(--text-muted); border: 1px solid var(--border); }
    .btn-cancel:hover { background: rgba(255, 255, 255, 0.05); color: var(--text); }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">CHAMP Multilevel Climate Governance</div>
      <h1>Connect to ChatGPT</h1>
      <p class="subtitle">ChatGPT is requesting secure, read-only access to the CHAMP Toolkit knowledge base via Model Context Protocol (MCP).</p>
    </div>

    <div class="permissions">
      <div class="perm-title">Allowed Capabilities</div>
      <ul class="perm-list">
        <li class="perm-item"><span class="perm-icon">✓</span> Read the 5 official CHAMP Actions and 14 Pathways</li>
        <li class="perm-item"><span class="perm-icon">✓</span> Retrieve verified Country Multilevel Governance Journeys</li>
        <li class="perm-item"><span class="perm-icon">✓</span> Generate personalised implementation guidance by National Lead</li>
        <li class="perm-item"><span class="perm-icon">✓</span> Read-only access — repository modifications are strictly blocked</li>
      </ul>
    </div>

    <div class="client-info">
      Redirecting to: <code>${this.escapeHtml(redirectUri)}</code>
    </div>

    <form method="POST" action="/oauth/authorize" class="actions">
      <input type="hidden" name="client_id" value="${this.escapeHtml(clientId)}" />
      <input type="hidden" name="redirect_uri" value="${this.escapeHtml(redirectUri)}" />
      <input type="hidden" name="state" value="${this.escapeHtml(state)}" />
      <input type="hidden" name="code_challenge" value="${this.escapeHtml(codeChallenge)}" />
      <input type="hidden" name="code_challenge_method" value="${this.escapeHtml(codeChallengeMethod)}" />
      <input type="hidden" name="scope" value="${this.escapeHtml(scope)}" />
      <input type="hidden" name="action" value="approve" />

      <button type="submit" class="btn btn-primary" id="btn-auth">Authorize & Connect</button>
      <a href="${this.escapeHtml(redirectUri)}?error=access_denied&error_description=User%20denied%20access${state ? `&state=${encodeURIComponent(state)}` : ""}" class="btn btn-cancel">Cancel</a>
    </form>
  </div>
</body>
</html>`;
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * 8. Auth Middleware with RFC 9728 WWW-Authenticate header
   */
  public createAuthMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Allow OPTIONS preflight
      if (req.method === "OPTIONS") {
        return next();
      }

      const authHeader = req.headers.authorization;
      const customHeader = req.headers["x-mcp-token"];
      const queryToken = req.query.token as string | undefined;

      let providedToken = "";
      if (authHeader) {
        const match = authHeader.match(/^Bearer\s+(.+)$/i);
        if (match) {
          providedToken = match[1].trim();
        }
      }
      if (!providedToken && customHeader) {
        providedToken = String(customHeader).trim();
      } else if (!providedToken && queryToken) {
        providedToken = queryToken.trim();
      }

      if (providedToken && this.validateToken(providedToken)) {
        return next();
      }

      // If no token is provided or token is invalid, return HTTP 401 with standard RFC 9728 header
      const baseUrl = this.getBaseUrl(req);
      const metadataUrl = `${baseUrl}/.well-known/oauth-protected-resource`;

      res.setHeader(
        "WWW-Authenticate",
        `Bearer resource_metadata="${metadataUrl}", error="invalid_token", error_description="Authentication required via OAuth 2.1 or MCP_AUTH_TOKEN"`
      );

      return res.status(401).json({
        error: "unauthorized",
        error_description: "Authentication required. Connect ChatGPT using OAuth or provide a valid Bearer token.",
        resource_metadata: metadataUrl
      });
    };
  }
}

export const defaultOAuthServer = new OAuthServer();
