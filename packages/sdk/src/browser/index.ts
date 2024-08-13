type CreateBrowserClientOpts = {
  environment?: string;
  frontendHost?: string;
  publicKey: string;
};

type AppId = string;

type StartConnectApp = {
  id: AppId;
};

type ConnectResult = {
  // TODO
};

class ConnectError extends Error { }

type StartConnectOpts = {
  token: string;
  app: AppId | StartConnectApp;
  onSuccess?: (res: ConnectResult) => void;
  onError?: (err: ConnectError) => void;
};

export function createClient(opts: CreateBrowserClientOpts) {
  return new BrowserClient(opts);
}

class BrowserClient {
  environment?: string;
  baseURL: string;
  publicKey: string;
  iframeURL: string;
  iframe?: HTMLIFrameElement;
  iframeId = 0;

  constructor(opts: CreateBrowserClientOpts) {
    this.environment = opts.environment;
    this.publicKey = opts.publicKey;
    this.baseURL = `https://${opts.frontendHost || "pipedream.com"}`;
    this.iframeURL = `${this.baseURL}/_static/connect.html`;
  }

  startConnect(opts: StartConnectOpts) {
    const onMessage = (e: MessageEvent) => {
      console.log("CONNECT ON MESSAGE", e)
      switch (e.data?.type) {
        case "verify-domain":
          // The Application should respond with it's domain to the iframe for security
          console.log("Sending Response to", e.origin)
          e.source?.postMessage(
            { type: "domain-response", origin: window.origin }, { targetOrigin: e.origin }
          )
          break;
        case "success":
          const { authProvisionId: id, ...rest } = e.data;
          console.log("SUCCESS!!!", e)

          opts.onSuccess?.({
            id,
            ...rest
          });
          break;
        case "error":
          // Return the error to the parent if there was a problem with the Authorization
          console.log("ERROR!!!", e)
          opts.onError?.(new ConnectError(e.data.error))
          break;
        case "close":
          console.log("CLOSE!!!", e)

          this.iframe?.remove()
          window.removeEventListener("message", onMessage)
          break;
        default:
          console.info('Unknown Connect Event type', e)
          break;
      }
    };
    window.addEventListener("message", onMessage);

    const qp = new URLSearchParams();
    qp.set("token", opts.token);
    if (this.environment) {
      qp.set("environment", this.environment);
    }
    qp.set("public_key", this.publicKey || process.env.PIPEDREAM_PROJECT_PUBLIC_KEY!!)
    if (typeof opts.app === "string") {
      qp.set("app", opts.app);
    } else {
      const err = new ConnectError("object app not yet supported");
      if (opts.onError) {
        opts.onError(err);
        return;
      }
      throw err;
    }

    const iframe = document.createElement("iframe");
    iframe.id = `pipedream-connect-iframe-${this.iframeId++}`;
    iframe.title = "Pipedream Connect";
    iframe.src = `${this.iframeURL}?${qp.toString()}`;
    iframe.setAttribute(
      "style",
      "position:fixed;inset:0;z-index:2147483647;border:0;display:block;overflow:hidden auto",
    );
    iframe.setAttribute("height", "100%");
    iframe.setAttribute("width", "100%");
    document.body.appendChild(iframe);
    this.iframe = iframe;
  }
}
