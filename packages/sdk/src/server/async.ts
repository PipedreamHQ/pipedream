import type { AccessToken } from "simple-oauth2";
import { AsyncResponseManager } from "../shared/async";
import type { AsyncResponseManagerOpts } from "../shared/async";
import { adapters } from "@rails/actioncable";
import * as WS from "ws";

declare global {
  function addEventListener(type: string, listener: () => void): void;
  function removeEventListener(type: string, listener: () => void): void;
}

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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    global.addEventListener = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    global.removeEventListener = () => {};
    if (typeof adapters.WebSocket === "undefined")
      adapters.WebSocket = WS as unknown as (typeof adapters)["WebSocket"];
  }

  protected override async getOpts(): Promise<AsyncResponseManagerOpts> {
    const oauthToken = await this.serverOpts.getOauthToken();
    if (!oauthToken?.token?.access_token) {
      throw new Error("Invalid OAuth token structure");
    }
    const token = oauthToken.token.access_token;
    const projectId = await this.serverOpts.getProjectId();
    return {
      url: `wss://${this.serverOpts.apiHost}/websocket?oauth_token=${token}`,
      subscriptionParams: {
        project_id: projectId,
      },
    };
  }
}
