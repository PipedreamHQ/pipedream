// This code is meant to be run client-side. Never provide project keys to the browser client,
// or make API requests to the Pipedream API to fetch credentials. The browser client is
// meant for initiating browser-specific operations, like connecting accounts via Pipedream Connect.
// See the server/ directory for the server client.

/**
 * Options for creating a browser-side client.
 * This is used to configure the BrowserClient instance.
 */
type CreateBrowserClientOpts = {
  /**
   * The environment in which the browser client is running (e.g., "production", "development").
   */
  environment?: string;

  /**
   * The frontend host URL. Used by Pipedream employees only. Defaults to "pipedream.com" if not provided.
   */
  frontendHost?: string;
};

/**
 * A unique identifier for an app.
 */
type AppId = string;

/**
 * Object representing an app to start connecting with.
 */
type StartConnectApp = {
  /**
   * The unique identifier of the app.
   */
  id: AppId;
};

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
   */
  token: string;

  /**
   * The app to connect to, either as an ID or an object containing the ID.
   */
  app: AppId | StartConnectApp;

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
 * const client = createClient({
 *   environment: "production",
 * });
 * ```
 * @param opts - The options for creating the browser client.
 * @returns A new instance of `BrowserClient`.
 */
export function createClient(opts: CreateBrowserClientOpts) {
  return new BrowserClient(opts);
}

/**
 * A client for interacting with the Pipedream Connect API from the browser.
 */
class BrowserClient {
  private environment?: string;
  private baseURL: string;
  private iframeURL: string;
  private iframe?: HTMLIFrameElement;
  private iframeId = 0;

  /**
   * Constructs a new `BrowserClient` instance.
   *
   * @param opts - The options for configuring the browser client.
   */
  constructor(opts: CreateBrowserClientOpts) {
    this.environment = opts.environment;
    this.baseURL = `https://${opts.frontendHost || "pipedream.com"}`;
    this.iframeURL = `${this.baseURL}/_static/connect.html`;
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
  connectAccount(opts: StartConnectOpts) {
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
      this.createIframe(opts);
    } catch (err) {
      opts.onError?.(err as ConnectError);
    }
  }

  /**
   * Cleans up the iframe and message event listener after the connection process is complete.
   *
   * @param onMessage - The message event handler to remove.
   */
  private cleanup(onMessage: (e: MessageEvent) => void) {
    this.iframe?.remove();
    window.removeEventListener("message", onMessage);
  }

  /**
   * Creates an iframe for the connection process and appends it to the document body.
   *
   * @param opts - The options for starting the connection process.
   *
   * @throws {ConnectError} If the app option is not a string.
   */
  private createIframe(opts: StartConnectOpts) {
    const qp = new URLSearchParams({
      token: opts.token,
    });

    if (this.environment) {
      qp.set("environment", this.environment);
    }

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
}
