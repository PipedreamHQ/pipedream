import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import cors from "cors"
import express, { Request, Response } from "express"
import { mcpNotificationPayload } from "./lib/mcpMessages"
import { serverFactory } from "./mcp-server"
import { statefulMcpServerFactory } from "./stateful-mcp-server"
import "./tracer"
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js"

import { randomUUID } from "node:crypto"

const app = express()
app.use(cors()) // Enable CORS for all origins
app.use(express.json())

const transports: Record<string, SSEServerTransport> = {}
const httpTransports: { [sessionId: string]: StreamableHTTPServerTransport } =
  {}
const userMcpSessions: Record<string, Record<string, string>[]> = {}

app.get("/", (req, res) => {
  console.log("Hello World")
  res.send("Hello World")
})

app.get("/v1/:uuid/sessions", async (req: Request, res: Response) => {
  console.log(
    "GET /v1/:uuid/sessions",
    req.body,
    req.params,
    req.url,
    req.headers,
    req.query
  )
  const mcpSessions = userMcpSessions[req.params.uuid] || []
  res.json({ mcpSessions })
})

// static app specific mcp servers
app.post("/v1/:uuid/:app", async (req: Request, res: Response) => {
  console.log("Received MCP request:", req.body)

  const sessionId = req.headers["mcp-session-id"] as string | undefined
  let transport: StreamableHTTPServerTransport

  try {
    if (sessionId && httpTransports[sessionId]) {
      // Reuse existing transport
      transport = httpTransports[sessionId]
      console.log(
        `Session resumed with ID: ${sessionId} for app: ${req.params.app}, uuid: ${req.params.uuid}`
      )
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request - create a stateful transport so SSE GET works
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (newSessionId) => {
          httpTransports[newSessionId] = transport
          console.log(
            `Session initialized with ID: ${newSessionId} for app: ${req.params.app}, uuid: ${req.params.uuid}`
          )
        },
      })

      transport.onclose = () => {
        const sid = transport.sessionId
        if (sid && httpTransports[sid]) {
          console.log(
            `Transport closed for session ${sid}, removing from transports map`
          )
          delete httpTransports[sid]
        }
      }

      console.log(
        `Starting serverFactory for app: ${req.params.app}, uuid: ${req.params.uuid}`
      )
      const server = await serverFactory({
        app: req.params.app,
        uuid: req.params.uuid,
      })
      console.log("Server factory successful, connecting transport")
      await server.connect(transport)
      await transport.handleRequest(req, res, req.body)
      return
    } else {
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      })
      return
    }

    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    console.error("Error handling MCP request:", error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      })
    }
  }
})

// Handle GET requests for SSE streams on app-specific servers
app.get("/v1/:uuid/:app", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined
  if (!sessionId || !httpTransports[sessionId]) {
    res.status(400).send("Invalid or missing session ID")
    return
  }

  const lastEventId = req.headers["last-event-id"] as string | undefined
  if (lastEventId) {
    console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`)
  } else {
    console.log(
      `Establishing new SSE stream for session ${sessionId}, app: ${req.params.app}, uuid: ${req.params.uuid}`
    )
  }

  const transport = httpTransports[sessionId]
  await transport.handleRequest(req, res)
})

// New route for uuid-only connections
app.post("/v1/:uuid", async (req: Request, res: Response) => {
  /*  console.log(
    "POST /v1/:uuid",
    req.body,
    req.params,
    req.url,
    req.headers,
    req.query
  )*/

  const sessionId = req.headers["mcp-session-id"] as string | undefined
  let transport: StreamableHTTPServerTransport

  try {
    if (sessionId && httpTransports[sessionId]) {
      // Reuse existing transport
      const chatId = req.headers["x-pd-mcp-chat-id"]
      transport = httpTransports[sessionId]
      console.log(
        `Session resumed with ID: ${sessionId} for uuid: ${req.params.uuid} chatId: ${chatId}`
      )
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // New initialization request
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (sessionId) => {
          // Store the transport by session ID when session is initialized
          // This avoids race conditions where requests might come in before the session is stored
          httpTransports[sessionId] = transport
          const chatId = req.headers["x-pd-mcp-chat-id"]
          const currentSessions = userMcpSessions[req.params.uuid] ?? {}
          currentSessions[chatId] = sessionId
          userMcpSessions[req.params.uuid] = currentSessions
          console.log(
            `Session initialized with ID: ${sessionId} for uuid: ${req.params.uuid} chatId: ${chatId}`
          )
        },
      })

      // Set up onclose handler to clean up transport when closed
      transport.onclose = () => {
        const sid = transport.sessionId
        if (sid && transports[sid]) {
          console.log(
            `Transport closed for session ${sid}, removing from transports map`
          )
          delete transports[sid]
        }
      }

      // Connect the transport to the MCP server BEFORE handling the request
      // so responses can flow back through the same transport
      console.log(`Starting dynamicServerFactory for uuid: ${req.params.uuid}`)
      const server = await statefulMcpServerFactory({
        uuid: req.params.uuid,
      })
      console.log("Server factory successful, connecting transport")
      await server.connect(transport)

      await transport.handleRequest(req, res, req.body)
      return // Already handled
    } else {
      // Invalid request - no session ID or not initialization request
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      })
      return
    }

    console.log("Connected to MCP server")
    await transport.handleRequest(req, res, req.body)
  } catch (error) {
    console.error("Error handling MCP request:", error)
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      })
    }
  }
})

// Handle GET requests for SSE streams (using built-in support from StreamableHTTP)
app.get("/v1/:uuid", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined
  if (!sessionId || !httpTransports[sessionId]) {
    res.status(400).send("Invalid or missing session ID")
    return
  }

  // Check for Last-Event-ID header for resumability
  const lastEventId = req.headers["last-event-id"] as string | undefined
  if (lastEventId) {
    console.log(`Client reconnecting with Last-Event-ID: ${lastEventId}`)
  } else {
    console.log(`Establishing new SSE stream for session ${sessionId}`)
  }

  const transport = httpTransports[sessionId]
  await transport.handleRequest(req, res)
})

// Handle DELETE requests for session termination (according to MCP spec)
app.delete("/v1/:uuid", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined
  if (!sessionId || !httpTransports[sessionId]) {
    res.status(400).send("Invalid or missing session ID")
    return
  }

  console.log(`Received session termination request for session ${sessionId}`)

  try {
    const transport = httpTransports[sessionId]
    await transport.handleRequest(req, res)
  } catch (error) {
    console.error("Error handling session termination:", error)
    if (!res.headersSent) {
      res.status(500).send("Error processing session termination")
    }
  }
})

// *** DEPRECATED SSE stuff
// Helper function to set up SSE headers and create transport
const setupSSEConnection = (
  res: Response<any, Record<string, any>>,
  messagePath: string
) => {
  res.setHeader("content-type", "text/event-stream")
  res.setHeader("cache-control", "no-cache")
  res.setHeader("connection", "keep-alive")
  console.log("Headers set for SSE connection")

  const transport = new SSEServerTransport(messagePath, res)
  // TODO: We need to also use some validation here to ensure only the owner can access the session
  transports[transport.sessionId] = transport
  return transport
}

// New route for uuid-only connections
app.get("/:uuid", async (req: Request, res: Response) => {
  console.log(
    "GET /:uuid",
    req.body,
    req.params,
    req.url,
    req.headers,
    req.query
  )

  const messagePath = `/${req.params.uuid}/messages`
  const transport = setupSSEConnection(res, messagePath)

  try {
    console.log(`Starting dynamicServerFactory for uuid: ${req.params.uuid}`)
    const server = await statefulMcpServerFactory({
      uuid: req.params.uuid,
    })
    console.log("Server factory successful, connecting transport")
    await server.connect(transport)

    console.log("Connected to MCP server")

    // Send an initial heartbeat to confirm connection
    res.write(
      `${mcpNotificationPayload({ method: "connection_established" })}\n\n`
    )

    const keepAlive = setInterval(() => {
      try {
        res.write(`${mcpNotificationPayload({ method: "keepalive" })}\n\n`)
      } catch (error) {
        console.error("Error sending keep-alive:", error)
        clearInterval(keepAlive)
      }
    }, 20_000)

    req.on("close", () => {
      console.log("SSE connection closed")
      delete transports[transport.sessionId]
      clearInterval(keepAlive)
    })
  } catch (error) {
    console.error("Error connecting to MCP server:", error)
    console.error(error.stack)
    res.status(500).end(`Failed to establish SSE connection: ${error.message}`)
  }
})

app.get("/:uuid/:app", async (req: Request, res: Response) => {
  console.log(
    "GET /:uuid/:app",
    req.body,
    req.params,
    req.url,
    req.headers,
    req.query
  )

  const messagePath = `/${req.params.uuid}/${req.params.app}/messages`
  const transport = setupSSEConnection(res, messagePath)

  try {
    console.log(
      `Starting serverFactory for app: ${req.params.app}, uuid: ${req.params.uuid}`
    )
    const server = await serverFactory({
      app: req.params.app,
      uuid: req.params.uuid,
    })
    console.log(
      `Server factory successful, connecting transport for app: ${req.params.app}, uuid: ${req.params.uuid}`
    )
    await server.connect(transport)

    console.log(
      `Connected to MCP server for app: ${req.params.app}, uuid: ${req.params.uuid}`
    )

    // Send an initial heartbeat to confirm connection
    res.write(
      `${mcpNotificationPayload({ method: "connection_established" })}\n\n`
    )

    req.on("close", () => {
      console.log("SSE connection closed")
      delete transports[transport.sessionId]
    })
  } catch (error) {
    console.error("Error connecting to MCP server:", error)
    console.error(req.params.app, req.params.uuid)
    console.error(error.stack)
    res.status(500).end(`Failed to establish SSE connection: ${error.message}`)
  }
})

// New route for uuid-only messages
app.post("/:uuid/messages", async (req: Request, res: Response) => {
  console.log("POST /:uuid/messages", req.query.sessionId)

  if (!req.query.sessionId || typeof req.query.sessionId !== "string") {
    res.status(400).json({ error: "Invalid sessionId" })
    return
  }

  const transport = transports[req.query.sessionId]
  if (!transport) {
    console.log("No transport found")
    res.status(500).json({ error: "No SSE connection established" })
    return
  }

  try {
    await transport.handlePostMessage(req, res, req.body)
    console.log("Message handled successfully")
    return
  } catch (error) {
    console.error("Error handling message:", error)
    res.status(500).json({ error: error.message })
    return
  }
})

app.post("/:uuid/:app/messages", async (req: Request, res: Response) => {
  console.log("POST /:uuid/:app/messages", req.query.sessionId)

  if (!req.query.sessionId || typeof req.query.sessionId !== "string") {
    res.status(400).json({ error: "Invalid sessionId" })
    return
  }

  const transport = transports[req.query.sessionId]
  if (!transport) {
    console.log("No transport found")
    res.status(500).json({ error: "No SSE connection established" })
    return
  }

  try {
    await transport.handlePostMessage(req, res, req.body)
    console.log("Message handled successfully")
    return
  } catch (error) {
    console.error("Error handling message:", error)
    res.status(500).json({ error: error.message })
    return
  }
})

app.on("error", (err) => {
  console.error(err)
})

// Add a global error handler to catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
})

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`)
  console.log("Headers:", req.headers)
  next()
})

app
  .listen(3010, () => {
    console.log("Server is running on port 3010")
    console.log("Routes configured:")
    console.log("- GET / - Health check")
    console.log("- GET /:uuid - Dynamic SSE connection endpoint")
    console.log("- POST /:uuid/messages - Dynamic message handler")
    console.log("- GET /:uuid/:app - App-specific SSE connection endpoint")
    console.log("- POST /:uuid/:app/messages - App-specific message handler")
  })
  .on("error", (err) => {
    console.error("Server startup error:", err)
  })
