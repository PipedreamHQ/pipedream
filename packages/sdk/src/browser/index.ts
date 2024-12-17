// This code is meant to be run client-side. Never provide project keys to the
// browser client, or make API requests to the Pipedream API to fetch
// credentials. The browser client is meant for initiating browser-specific
// operations, like connecting accounts via Pipedream Connect. See the server/
// directory for the server client.

import {
  AccountsRequestResponse,
  BaseClient,
  GetAccountOpts,
  type ConnectTokenResponse,
} from "../shared/index.js";
export type * from "../shared/index.js";

/**
 * Options for creating a browser-side client. This is used to configure the
 * BrowserClient instance.
 */
type CreateBrowserClientOpts = {
  /**
   * @deprecated environment is set on the server when generating the client token
   */
  environment?: string;

  /**
   * The frontend host URL. Used by Pipedream employees only. Defaults to
   * "pipedream.com" if not provided.
   */
  frontendHost?: string;

  /**
   * The API host URL. Used by Pipedream employees. Defaults to
   * "api.pipedream.com" if not provided.
   */
  apiHost?: string;

  /**
   * Will be called whenever we need a new token.
   *
   * The callback function should return the response from
   * `serverClient.createConnectToken`.
   */
  tokenCallback?: TokenCallback;

  /**
   * An external user ID associated with the token.
   */
  externalUserId?: string;
};

export type TokenCallback = (opts: {
  externalUserId: string;
}) => Promise<ConnectTokenResponse>;

/**
 * The name slug for an app, a unique, human-readable identifier like "github"
 * or "google_sheets". Find this in the Authentication section for any app's
 * page at https://pipedream.com/apps. For more information about name slugs,
 * see https://pipedream.com/docs/connect/quickstart#find-your-apps-name-slug.
 */
type AppNameSlug = string;

/**
 * The result of a successful connection.
 */
type ConnectResult = {
  /**
   * The unique identifier of the connected account.
   */
  id: string;
};

/**
 * Custom error class for handling connection errors.
 */
class ConnectError extends Error {}

/**
 * Options for starting the connection process.
 */
type StartConnectOpts = {
  /**
   * The token used for authenticating the connection.
   *
   * Optional if client already initialized with token
   */
  token?: string;

  /**
   * The app to connect to, either as an ID or an object containing the ID.
   */
  app: AppNameSlug;

  /**
   * The OAuth app ID to connect to.
   */
  oauthAppId?: string;

  /**
   * Callback function to be called upon successful connection.
   *
   * @param res - The result of the connection.
   */
  onSuccess?: (res: ConnectResult) => void;

  /**
   * Callback function to be called if an error occurs during the connection.
   *
   * @param err - The error that occurred during the connection.
   */
  onError?: (err: ConnectError) => void;
};

/**
 * Creates a new instance of `BrowserClient` with the provided options.
 *
 * @example
 * ```typescript
    const client = createFrontendClient({
      tokenCallback,
      externalUserId,
    });
 * ```
 * @param opts - The options for creating the browser client.
 * @returns A new instance of `BrowserClient`.
 */
export function createFrontendClient(opts: CreateBrowserClientOpts = {}) {
  return new BrowserClient(opts);
}

/**
 * A client for interacting with the Pipedream Connect API from the browser.
 */
export class BrowserClient extends BaseClient {
  private baseURL: string;
  private iframeURL: string;
  private iframe?: HTMLIFrameElement;
  private iframeId = 0;
  private tokenCallback?: TokenCallback;
  private _token?: string;
  private _tokenExpiresAt?: Date;
  private _tokenRequest?: Promise<string>;
  externalUserId?: string;

  /**
   * Constructs a new `BrowserClient` instance.
   *
   * @param opts - The options for configuring the browser client.
   */
  constructor(opts: CreateBrowserClientOpts) {
    super(opts);
    this.baseURL = `https://${opts.frontendHost || "pipedream.com"}`;
    this.iframeURL = `${this.baseURL}/_static/connect.html`;
    this.tokenCallback = opts.tokenCallback;
    this.externalUserId = opts.externalUserId;
  }

  private async token() {
    if (
      this._token &&
      this._tokenExpiresAt &&
      this._tokenExpiresAt > new Date()
    ) {
      return this._token;
    }

    if (this._tokenRequest) {
      return this._tokenRequest;
    }

    const tokenCallback = this.tokenCallback;
    const externalUserId = this.externalUserId;

    if (!tokenCallback) {
      throw new Error("No token callback provided");
    }
    if (!externalUserId) {
      throw new Error("No external user ID provided");
    }

    // Ensure only one token request is in-flight at a time.
    this._tokenRequest = (async () => {
      const {
        token, expires_at,
      } = await tokenCallback({
        externalUserId: externalUserId,
      });
      this._token = token;
      this._tokenExpiresAt = new Date(expires_at);
      this._tokenRequest = undefined;
      return token;
    })();

    return this._tokenRequest;
  }

  private refreshToken() {
    this._token = undefined;
  }

  /**
   * Initiates the process of connecting an account.
   *
   * @param opts - The options for starting the connection process.
   *
   * @example
   * ```typescript
   * client.connectAccount({
   *   token: "your-token",
   *   app: "your-app-id",
   *   onSuccess: (res) => {
   *     console.log("Connected account ID:", res.id);
   *   },
   *   onError: (err) => {
   *     console.error("Connection error:", err);
   *   },
   * });
   * ```
   */
  public async connectAccount(opts: StartConnectOpts) {
    const onMessage = (e: MessageEvent) => {
      switch (e.data?.type) {
      case "success":
        opts.onSuccess?.({
          id: e.data?.authProvisionId,
        });
        break;
      case "error":
        opts.onError?.(new ConnectError(e.data.error));
        break;
      case "close":
        this.cleanup(onMessage);
        break;
      default:
        break;
      }
    };

    window.addEventListener("message", onMessage);

    try {
      await this.createIframe(opts);
    } catch (err) {
      opts.onError?.(err as ConnectError);
    }
    this.refreshToken(); // token expires once it's used to create a connected account. We need to get a new token for the next requests.
  }

  /**
   * Cleans up the iframe and message event listener after the connection
   * process is complete.
   *
   * @param onMessage - The message event handler to remove.
   */
  private cleanup(onMessage: (e: MessageEvent) => void) {
    this.iframe?.remove();
    window.removeEventListener("message", onMessage);
  }

  /**
   * Creates an iframe for the connection process and appends it to the document
   * body.
   *
   * @param opts - The options for starting the connection process.
   *
   * @throws {ConnectError} If the app option is not a string.
   */
  private async createIframe(opts: StartConnectOpts) {
    const token = opts.token || (await this.token());
    const qp = new URLSearchParams({
      token,
    });

    if (typeof opts.app === "string") {
      qp.set("app", opts.app);
    } else {
      throw new ConnectError("Object app not yet supported");
    }

    if (opts.oauthAppId) {
      qp.set("oauthAppId", opts.oauthAppId);
    }

    const iframe = document.createElement("iframe");
    iframe.id = `pipedream-connect-iframe-${this.iframeId++}`;
    iframe.title = "Pipedream Connect";
    iframe.src = `${this.iframeURL}?${qp.toString()}`;
    iframe.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;border:0;display:block;overflow:hidden auto";
    iframe.width = "100%";
    iframe.height = "100%";

    iframe.onload = () => {
      this.iframe = iframe;
    };

    document.body.appendChild(iframe);
  }

  protected async authHeaders(): Promise<string> {
    if (!(await this.token())) {
      throw new Error("No token provided");
    }
    return `Bearer ${await this.token()}`;
  }

  public getAccounts(
    params?: Omit<GetAccountOpts, "external_user_id">,
  ): Promise<AccountsRequestResponse> {
    return super.getAccounts(params);
  }
}
