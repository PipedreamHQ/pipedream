type CreateBrowserClientOpts = {
  environment?: string;
  frontendHost?: string;
};

type AppId = string;

type StartConnectApp = {
  id: AppId;
};

type ConnectResult = {
  // XXX TO DO
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
  iframeURL: string;
  iframe?: HTMLIFrameElement;
  iframeId = 0;

  constructor(opts: CreateBrowserClientOpts) {
    this.environment = opts.environment;
    this.baseURL = `https://${opts.frontendHost || "https://pipedream.com"}`;
    this.iframeURL = `${this.baseURL}/_static/connect.html`;
  }

  startConnect(opts: StartConnectOpts) {
    const onMessage = (e: MessageEvent) => {
      switch (e.data?.type) {
      case "verify-domain":
        if (e.origin === this.baseURL && this.iframe?.contentWindow) {
          this.iframe.contentWindow.postMessage(
            {
              type: "domain-response",
              origin: window.origin,
            }, {
              targetOrigin: e.origin,
            },
          );
        } else {
          console.warn("Untrusted origin or iframe not ready:", e.origin);
        }
        break;
      case "success": {
        const {
          authProvisionId: id, ...rest
        } = e.data;
        console.log("SUCCESS!!!", e);
        opts.onSuccess?.({
          id,
          ...rest,
        });
        break;
      }
      case "error":
        console.log("ERROR!!!", e);
        opts.onError?.(new ConnectError(e.data.error));
        break;
      case "close":
        console.log("CLOSE!!!", e);
        this.iframe?.remove();
        window.removeEventListener("message", onMessage);
        break;
      default:
        console.debug("Unknown Connect Event type", e);
        break;
      }
    };

    window.addEventListener("message", onMessage);

    const qp = new URLSearchParams();
    qp.set("token", opts.token);
    if (this.environment) {
      qp.set("environment", this.environment);
    }
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

    iframe.onload = () => {
      this.iframe = iframe;
    };

    document.body.appendChild(iframe);
  }
}
