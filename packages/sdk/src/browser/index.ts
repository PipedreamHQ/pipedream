type CreateBrowserClientOpts = {
  environment?: string;
  publicKey: string;
};

type AppId = string;

type StartConnectApp = {
  id: AppId;
};

type ConnectResult = {
  // TODO
};

class ConnectError extends Error {}

type StartConnectOpts = {
  token: string;
  userId: string;
  app: AppId | StartConnectApp;
  onSuccess?: (res: ConnectResult) => void;
  onError?: (err: ConnectError) => void;
};

const PIPEDREAM_BASE_URL = "https://frontend.gkes.pipedream.net";
const IFRAME_URL = `${PIPEDREAM_BASE_URL}/_static/connect.html`;

export function createClient(opts: CreateBrowserClientOpts) {
  return new BrowserClient(opts);
}

class BrowserClient {
  environment?: string;
  publicKey: string;
  iframe?: HTMLIFrameElement;
  iframeId = 0;

  constructor(opts: CreateBrowserClientOpts) {
    this.environment = opts.environment;
    this.publicKey = opts.publicKey;
  }

  startConnect(opts: StartConnectOpts) {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== PIPEDREAM_BASE_URL) {
        console.warn("Received message from unauthorized origin:", e.origin);
        return;
      }
      if (e.data?.type === "close") {
        this.iframe?.remove();
        window.removeEventListener("message", onMessage);
      } else if (e.data?.type === "success") {
        opts.onSuccess?.({
          id: e.data.authProvisionId,
        });
      } else if (e.data?.type === "error") {
        opts.onError?.(new ConnectError(e.data.error));
      }
    };
    window.addEventListener("message", onMessage);

    const qp = new URLSearchParams();
    qp.set("token", opts.token);
    qp.set("publicKey", this.publicKey);
    qp.set("userId", opts.userId);
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
    iframe.src = `${IFRAME_URL}?${qp.toString()}`;
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
