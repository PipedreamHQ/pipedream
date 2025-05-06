import { createBackendClient } from "@pipedream/sdk"
import { z } from "zod"

export const pd = createBackendClient({
  credentials: {
    clientId: z.string().parse(process.env.PIPEDREAM_CLIENT_ID),
    clientSecret: z.string().parse(process.env.PIPEDREAM_CLIENT_SECRET),
  },
  projectId: z.string().parse(process.env.PIPEDREAM_PROJECT_ID),
  environment: z
    .enum(["development", "production"])
    .parse(process.env.PIPEDREAM_PROJECT_ENVIRONMENT),
})

export const slackComponents = async () => {
  return await pd.getComponents({
    app: "slack",
    componentType: "action",
  })
}
