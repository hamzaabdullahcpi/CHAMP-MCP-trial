/**
 * Standalone MCP Server Runner for Render or dedicated container deployment.
 */

import express from "express";
import dotenv from "dotenv";
import { createMcpExpressRouter } from "./server";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "10mb" }));

// CORS configuration compatible with ChatGPT and web clients
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-MCP-Token, X-Requested-With, Accept"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Mount MCP router
app.use("/", createMcpExpressRouter());

// Root welcome message or SSE probe
app.get("/", (req, res, next) => {
  if (req.headers.accept?.includes("text/event-stream")) {
    return next();
  }
  res.json({
    name: "CHAMP MCP Knowledge Assistant",
    status: "online",
    healthCheck: "/health",
    mcpEndpoint: "/mcp",
    docs: "Connect this remote MCP server to ChatGPT via Custom MCP App integration.",
    tools: [
      "search_champ_knowledge",
      "list_champ_actions",
      "get_toolkit_pathway",
      "get_country_journey",
      "compare_country_approaches",
      "list_national_leads",
      "get_guidance_by_national_lead"
    ]
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`=======================================================`);
  console.log(`🚀 CHAMP MCP Knowledge Server running on port ${PORT}`);
  console.log(`📡 Health Check:  http://0.0.0.0:${PORT}/health`);
  console.log(`🔌 MCP Endpoint:  http://0.0.0.0:${PORT}/mcp`);
  console.log(`=======================================================`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, closing HTTP server...");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("SIGINT received, closing HTTP server...");
  server.close(() => process.exit(0));
});
