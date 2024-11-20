import type { AccessToken } from "simple-oauth2";
import { AsyncResponseManager } from "../shared/async";
import type { AsyncResponseManagerOpts } from "../shared/async";
import { adapters } from "@rails/actioncable";
import * as WS from "ws";

export type ServerAsyncResponseManagerOpts = {
  apiHost: string;
  getOauthToken: () => Promise<AccessToken> | AccessToken;
  getProjectId: () => Promise<string> | string;
};

export class ServerAsyncResponseManager extends AsyncResponseManager {
  private serverOpts: ServerAsyncResponseManagerOpts;

  constructor(opts: ServerAsyncResponseManagerOpts) {
    super();
    this.serverOpts = opts;
    if (typeof adapters.WebSocket === "undefined")
      adapters.WebSocket == WS;
  }

  protected override async getOpts(): Promise<AsyncResponseManagerOpts> {
    const token = await this.serverOpts.getOauthToken();
    const projectId = await this.serverOpts.getProjectId();
    return {
      url: `wss://${this.serverOpts.apiHost}/websocket?oauth_token=${token}`,
      subscriptionParams: {
        project_id: projectId,
      },
    };
  }
}
