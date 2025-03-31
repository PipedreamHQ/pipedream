#!/usr/bin/env node

import { Command } from "commander"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Get package.json version in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../package.json"), "utf8"),
)
const version = packageJson.version

const program = new Command()

program
  .name("@pipedream/mcp")
  .description("Pipedream MCP server CLI")
  .version(version)

program
  .command("stdio")
  .description("Start the stdio server")
  .requiredOption("--app <app>", "Specify the MCP app name")
  .option(
    "--external-user-id <id>",
    "Specify the external user ID (defaults to a random UUID)",
  )
  .action(async (options) => {
    try {
      const { main } = await import("./stdio.js")
      await main(options.app, options.externalUserId)
    } catch (error) {
      console.error("Error starting stdio server:", error)
      process.exit(1)
    }
  })

program
  .command("sse")
  .description("Start the SSE server (default port: 3010)")
  .option("--app <app>", "Specify the MCP app name")
  .option("--port <port>", "Specify the port to run the server on")
  .action(async (options) => {
    try {
      const { main } = await import("./sse.js")
      await main(options.app, options.port)
    } catch (error) {
      console.error("Error starting SSE server:", error)
      process.exit(1)
    }
  })

program.parse()
