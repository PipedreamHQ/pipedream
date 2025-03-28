import { createBackendClient } from "@pipedream/sdk/server"
import { z } from "zod"
import { config } from "./config.js"

// Pipedream API client
export const createPdClient = () => {
  try {
    const clientId = z.string().parse(config.pipedream.clientId)
    const clientSecret = z.string().parse(config.pipedream.clientSecret)
    const projectId = z.string().parse(config.pipedream.projectId)
    const environment = z
      .enum([
        "development",
        "production",
      ])
      .parse(config.pipedream.environment)

    return createBackendClient({
      credentials: {
        clientId,
        clientSecret,
      },
      projectId,
      environment,
    })
  } catch (error) {
    console.error(
      "Failed to create Pipedream client:",
      error instanceof Error
        ? error.message
        : "Unknown error",
    )
    console.error("Make sure you've set all required environment variables:")
    console.error("- PIPEDREAM_CLIENT_ID (not shown for security)")
    console.error("- PIPEDREAM_CLIENT_SECRET (not shown for security)")
    console.error("- PIPEDREAM_PROJECT_ID (not shown for security)")
    console.error("- PIPEDREAM_PROJECT_ENVIRONMENT (defaults to 'development')")

    // Create a more descriptive error message that includes original error
    const errorMessage =
      error instanceof Error
        ? `Missing or invalid Pipedream configuration: ${error.message}`
        : "Missing or invalid Pipedream configuration"

    throw new Error(errorMessage)
  }
}
