import express from "express"
import cors from "cors"
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { serverFactory } from "./mcp-server.js"
import { fileURLToPath } from "url"
import { config } from "../lib/config.js"

// In a production environment, you'd handle sessions in Redis
// or another persistent store, rather than in memory
const transports = new Map<string, SSEServerTransport>()

// Helper function to create transport without setting headers
// (headers will be set by transport.start() when called by server.connect())
const setupSSEConnection = (res: express.Response, messagePath: string) => {
  console.log("Creating SSE transport")
  const transport = new SSEServerTransport(messagePath, res)
  transports.set(transport.sessionId, transport)
  return transport
}

export async function main(appName?: string, portOption?: string) {
  const app = express()

  // Log all requests for debugging
  app.use((req, res, next) => {
    console.log(
      `Received ${req.method} request for ${req.url.replace(/\/[^/]+\//, "/[REDACTED]/")}`,
    )
    next()
  })

  app.use(cors()) // Enable CORS for all origins
  app.use(express.json())

  // Use provided port or fallback to env var or default from config
  const port = portOption || process.env.PORT || config.serverPort

  app.get("/", (req, res) => {
    console.log("Health check")
    res.send("Hello World")
  })

  // Define reusable handlers to avoid code duplication
  const handleSSEConnection = async (
    req: express.Request,
    res: express.Response,
    appName: string,
  ) => {
    const messagePath = `/${req.params.external_user_id}/${appName}/messages`
    const transport = setupSSEConnection(res, messagePath)

    try {
      console.log(
        `Starting serverFactory for app: ${appName}, external_user_id: [REDACTED]`,
      )
      const server = await serverFactory({
        app: appName,
        externalUserId: req.params.external_user_id,
      })
      console.log("Server factory successful, connecting transport")
      await server.connect(transport)

      console.log("Connected to MCP server")

      req.on("close", () => {
        console.log("SSE connection closed")
        transports.delete(transport.sessionId)
      })
    } catch (error) {
      console.error("Error connecting to MCP server:", error)
      if (error instanceof Error) {
        console.error(error.stack)
        res
          .status(500)
          .end(`Failed to establish SSE connection: ${error.message}`)
      } else {
        // For non-Error objects that were thrown
        res
          .status(500)
          .end(`Failed to establish SSE connection: ${String(error)}`)
      }
    }
  }

  const handlePostMessage = async (
    req: express.Request,
    res: express.Response,
  ) => {
    if (!req.query.sessionId || typeof req.query.sessionId !== "string") {
      res.status(400).json({
        error: "Invalid sessionId",
      })
      return
    }

    const transport = transports.get(req.query.sessionId)
    if (!transport) {
      console.log("No transport found")
      res.status(500).json({
        error: "No SSE connection established",
      })
      return
    }

    try {
      await transport.handlePostMessage(req, res, req.body)
      console.log("Message handled successfully")
      return
    } catch (error) {
      console.error("Error handling message:", error)
      if (error instanceof Error) {
        console.error(error.stack)
        res.status(500).json({
          error: error.message,
        })
      } else {
        // For non-Error objects that were thrown
        res.status(500).json({
          error: String(error),
        })
      }
      return
    }
  }

  if (appName) {
    // If app is explicitly passed via CLI, set up specific routes for that app only
    app.get(`/:external_user_id/${appName}`, async (req, res) => {
      console.log(`GET /:external_user_id/${appName}`)
      await handleSSEConnection(req, res, appName)
    })

    app.post(`/:external_user_id/${appName}/messages`, async (req, res) => {
      console.log(
        `POST /:external_user_id/${appName}/messages`,
        "[REDACTED]", // Redacted sessionId
      )
      await handlePostMessage(req, res)
    })
  } else {
    // Generic routes for any app
    app.get("/:external_user_id/:app", async (req, res) => {
      console.log(`GET /:external_user_id/[REDACTED] (app: ${req.params.app})`)
      await handleSSEConnection(req, res, req.params.app)
    })

    app.post("/:external_user_id/:app/messages", async (req, res) => {
      console.log("POST /:external_user_id/:app/messages", "[REDACTED]") // Redacted sessionId
      await handlePostMessage(req, res)
    })
  }

  app.on("error", (err) => {
    console.error(err)
  })

  // Add a global error handler to catch unhandled promise rejections
  process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason)
  })

  app
    .listen(port, () => {
      console.log(`Server is running on port ${port}`)
      console.log("Routes configured:")
      console.log("- GET / - Health check")
      if (appName) {
        console.log(
          `- GET /:external_user_id/${appName} - App-specific SSE connection endpoint`,
        )
        console.log(
          `- POST /:external_user_id/${appName}/messages - App-specific message handler`,
        )
      } else {
        console.log(
          "- GET /:external_user_id/:app - App-specific SSE connection endpoint",
        )
        console.log(
          "- POST /:external_user_id/:app/messages - App-specific message handler",
        )
      }
    })
    .on("error", (err) => {
      console.error("Server startup error:", err)
    })
}

// Only auto-start if this module is the entry point
// In ES modules, we need to check if the current file URL is the same as import.meta.url

// Check if this file is being run directly
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url)

if (isMainModule) {
  main().catch((error) => {
    console.error("Fatal error in main():", error)
    process.exit(1)
  })
}
