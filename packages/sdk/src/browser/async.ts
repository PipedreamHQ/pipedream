import { AsyncResponseManager } from "../shared/async.js";
import type { AsyncResponseManagerOpts } from "../shared/async.js";

export type BrowserAsyncResponseManagerOpts = {
  apiHost: string;
  getConnectToken: () => Promise<string>;
};

export class BrowserAsyncResponseManager extends AsyncResponseManager {
  private browserOpts: BrowserAsyncResponseManagerOpts;

  constructor(opts: BrowserAsyncResponseManagerOpts) {
    super();
    this.browserOpts = opts;
  }

  protected override async getOpts(): Promise<AsyncResponseManagerOpts> {
    const token = await this.browserOpts.getConnectToken();
    const url = `wss://${this.browserOpts.apiHost}/websocket?ctok=${token}`;
    return {
      url,
    };
  }
}
