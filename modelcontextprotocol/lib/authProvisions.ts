import { createPdClient } from "./pd-client.js"
import { config } from "./config.js"
import { Account } from "@pipedream/sdk"

export const getAuthProvision = async ({
  app,
  externalUserId,
}: {
  app: string
  externalUserId: string
}): Promise<Account | string> => {
  const pd = createPdClient()

  // Get existing auth provisions for this user and app
  const authProvisions = await pd.getAccounts({
    external_user_id: externalUserId,
    include_credentials: false,
    app,
  })

  // "healthy" auth provisions have active, valid OAuth grants / credentials
  // This naive implementation returns the first healthy auth provision for the app
  const authProvision = authProvisions.data.find((ap) => ap.healthy)

  // If no healthy auth provision exists, return a Pipedream-hosted link
  // your users can use to connect their account.
  // https://pipedream.com/docs/connect/managed-auth/connect-link/
  if (!authProvision) {
    const token = await pd.createConnectToken({
      external_user_id: externalUserId,
      webhook_uri: config.pipedream.webhookUri,
    })

    return `
You need to connect your account to call this tool.

Please visit this URL to securely authenticate with ${app}:

https://pipedream.com/_static/connect.html?token=${token.token}&connectLink=true&app=${encodeURIComponent(app)}

Let me know when you're done.
        `.trim()
  }

  return authProvision
}
