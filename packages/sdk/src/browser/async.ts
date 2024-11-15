import { AsyncResponseManager } from "../shared/async"
import type { AsyncResponseManagerOpts } from "../shared/async"
import { createConsumer } from "@rails/actioncable"
import type { Consumer } from "@rails/actioncable"

export type BrowserAsyncResponseManagerOpts = AsyncResponseManagerOpts & {
  getConnectToken: () => Promise<string>
}

export class BrowserAsyncResponseManager extends AsyncResponseManager {
  private getConnectToken: BrowserAsyncResponseManagerOpts["getConnectToken"]

  constructor(opts: BrowserAsyncResponseManagerOpts) {
    const { getConnectToken, ..._opts } = opts
    super(_opts)
    this.getConnectToken = getConnectToken
  }

  protected override async createCable(): Promise<Consumer> {
    const token = await this.getConnectToken()
    const url = `wss://${this.apiHost}/websocket?ctok=${token}`
    return createConsumer(url) as Consumer
  }
}
