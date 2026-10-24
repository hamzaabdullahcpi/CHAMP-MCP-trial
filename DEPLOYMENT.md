# CHAMP MCP Knowledge Assistant - Render Deployment Guide

This guide describes how to deploy the **CHAMP Model Context Protocol (MCP) Server** to **Render** as a secure, production-grade, read-only remote MCP service.

---

## 1. Architecture Overview

The CHAMP MCP server provides:
- **Streamable HTTP & SSE Transport**: Remote `/mcp` endpoint compatible with ChatGPT and standard MCP clients.
- **OAuth 2.1 & RFC 8414 / RFC 9728 Discovery**: Full support for ChatGPT custom MCP connection via standard OAuth 2.1 discovery and PKCE.
- **Health Check Endpoint**: `/health` verifying service uptime, base connectivity, action/country counts, and OAuth endpoints.
- **Read-Only Airtable Connector**: Strictly reads from approved tables and fields with 429 rate-limit backoff and in-memory TTL caching.
- **Security & Privacy**: Airtable PAT and Base ID remain strictly server-side. No credentials are ever exposed to clients.
- **Dual Authentication**: Accepts OAuth 2.1 Bearer access tokens issued by the server AND static `MCP_AUTH_TOKEN` for script/curl clients.

---

## 2. Prerequisites & Environment Variables

Before deploying, ensure you have:
1. **Airtable Personal Access Token (PAT)** with read permissions on your base (`data.records:read`, `schema.bases:read`).
2. **Airtable Base ID** (e.g., `app...` found in the Airtable API URL).
3. A **Render account** ([render.com](https://render.com)).
4. Access to your GitHub repository: `https://github.com/hamzaabdullahcpi/CHAMP-MCP-trial`.

### Environment Variables on Render
| Key | Required | Value / Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` |
| `PORT` | Yes | `10000` (Render default port) |
| `AIRTABLE_BASE_ID` | Yes | Your Airtable Base ID (`app...`) |
| `AIRTABLE_PAT` | Yes | Your Airtable Personal Access Token (`pat...`) |
| `MCP_AUTH_TOKEN` | Optional | Static fallback token for direct curl / script testing |

> **Note on OAuth Secrets**: You do **not** need to configure any new OAuth client IDs or secrets in Render. The server dynamically registers ChatGPT (RFC 7591) and uses PKCE with SHA-256 (`S256`), which is standard and secure for OAuth 2.1. Existing secrets remain unchanged.

---

## 3. Deployment on Render

### Option A: Blueprint Deployment using `render.yaml` (Recommended)

1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository `hamzaabdullahcpi/CHAMP-MCP-trial`.
4. Render will detect `render.yaml` automatically.
5. In the configuration screen, provide values for the required secrets:
   - `AIRTABLE_BASE_ID`: Your Airtable base ID.
   - `AIRTABLE_PAT`: Your Airtable Personal Access Token.
   - `MCP_AUTH_TOKEN`: (Optional; Render can generate or you can paste a secret string).
6. Click **Apply**. Render will install dependencies, build the server, and launch the service.

---

### Option B: Manual Web Service Setup

If you prefer setting up the Web Service manually:

1. In Render Dashboard, click **New +** → **Web Service**.
2. Select your repository `hamzaabdullahcpi/CHAMP-MCP-trial`.
3. Configure the service settings:
   - **Name**: `champ-mcp-knowledge-server`
   - **Region**: Frankfurt (or closest to your users)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build:mcp`
   - **Start Command**: `npm run start:mcp`
   - **Plan**: `Starter` (or Free for prototyping)
4. Under **Advanced Settings**, configure:
   - **Health Check Path**: `/health`
5. Under **Environment Variables**, add `AIRTABLE_BASE_ID`, `AIRTABLE_PAT`, `NODE_ENV=production`, and `PORT=10000`.
6. Click **Create Web Service**.

---

## 4. Verification & Testing

### 1. Verify Health Check
Open your Render service URL in a browser or terminal:

```bash
curl -i https://<your-render-subdomain>.onrender.com/health
```

Expected Response (`200 OK`):
```json
{
  "status": "healthy",
  "service": "CHAMP MCP Knowledge Assistant",
  "uptimeSeconds": 15,
  "timestamp": "2026-10-23T17:15:00.000Z",
  "version": "1.0.0",
  "airtable": {
    "configured": true,
    "actionsCount": 5,
    "countryCount": 3
  },
  "mcpEndpoints": {
    "streamableHttp": "/mcp",
    "sseEndpoint": "/mcp/sse",
    "messagesEndpoint": "/mcp/messages"
  }
}
```

### 2. Verify MCP Tool Discovery
Test that the `/mcp` endpoint discovers all 7 tools:

```bash
curl -X POST https://<your-render-subdomain>.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_MCP_AUTH_TOKEN>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

Expected Response:
A JSON-RPC response listing the 7 tools:
1. `search_champ_knowledge`
2. `list_champ_actions`
3. `get_toolkit_pathway`
4. `get_country_journey`
5. `compare_country_approaches`
6. `list_national_leads`
7. `get_guidance_by_national_lead`

### 3. Verify Priority Personalisation Tool
Execute a test call to `get_guidance_by_national_lead`:

```bash
curl -X POST https://<your-render-subdomain>.onrender.com/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_MCP_AUTH_TOKEN>" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "get_guidance_by_national_lead",
      "arguments": {
        "national_lead": "Climate / Environment Ministry",
        "action_id": 1,
        "country": "Sweden"
      }
    }
  }'
```

---

## 5. Security & Reliability Highlights

1. **Read-Only Guarantees**: The MCP server contains no mutation endpoints. It cannot create, update, or delete any records in Airtable.
2. **Credential Isolation**: The Airtable PAT never leaves the server process and is excluded from logs and client responses.
3. **Publication Filtering**: Incomplete, coming-soon, or unpublished Country Journeys (e.g. Morocco or Brazil) are filtered out from deep-dive and comparison responses.
4. **Rate-Limit Resilience**: The server caches Airtable responses for 5 minutes and automatically retries requests with exponential backoff on HTTP 429.
