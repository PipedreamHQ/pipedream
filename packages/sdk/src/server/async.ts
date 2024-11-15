import type { AccessToken } from "simple-oauth2"
import { AsyncResponseManager } from "../shared/async"
import type { AsyncResponseManagerOpts } from "../shared/async"
import { adapters, createConsumer } from "@rails/actioncable"
import type { Consumer } from "@rails/actioncable"
import * as WS from "ws"

type ConsumerWithSubProtocols = Consumer & {
  addSubProtocol: (protocol: string) => void
}

export type ServerAsyncResponseManagerOpts = AsyncResponseManagerOpts & {
  getOauthToken: () => AccessToken
}

export class ServerAsyncResponseManager extends AsyncResponseManager {
  private getOauthToken: ServerAsyncResponseManagerOpts["getOauthToken"]

  constructor(opts: ServerAsyncResponseManagerOpts) {
    const { getOauthToken, ..._opts } = opts
    super(_opts)
    this.getOauthToken = getOauthToken
  }

  protected override async createCable(): Promise<Consumer> {
    if (typeof adapters.WebSocket === "undefined")
      adapters.WebSocket == WS
    const token = await this.getOauthToken()
    const url = `wss://${this.apiHost}/websocket`
    const cable = createConsumer(url) as ConsumerWithSubProtocols
    cable.addSubProtocol(`token=${token}`)
    return cable
  }
}
