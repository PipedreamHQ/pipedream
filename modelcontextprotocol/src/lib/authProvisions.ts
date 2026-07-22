import { pd } from "../pd-client"
import { Account } from "@pipedream/sdk"

export const getAuthProvision = async ({
  app,
  uuid,
  webhookUri,
}: {
  app: string
  uuid: string
  webhookUri?: string
}): Promise<Account | string> => {
  const authProvisions = await pd.getAccounts({
    external_user_id: uuid,
    include_credentials: false,
    app,
  })

  const authProvision = authProvisions.data.find((ap) => ap.healthy)

  if (!authProvision) {
    const token = await pd.createConnectToken({
      external_user_id: uuid,
      ...(webhookUri && { webhook_uri: webhookUri }),
    })
    return `
Go to: https://pipedream.com/_static/connect.html?token=${token.token}&connectLink=true&app=${encodeURIComponent(app)} to connect your account.
            `.trim()
  }

  return authProvision
}
