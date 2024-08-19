type CreateBrowserClientOpts = {
  environment?: string;
  frontendHost?: string;
};

type AppId = string;

type StartConnectApp = {
  id: AppId;
};

type ConnectResult = {
  id: string;
};

class ConnectError extends Error {}

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
  private environment?: string;
  private baseURL: string;
  private iframeURL: string;
  private iframe?: HTMLIFrameElement;
  private iframeId = 0;

  constructor(opts: CreateBrowserClientOpts) {
    this.environment = opts.environment;
    this.baseURL = `https://${opts.frontendHost || "pipedream.com"}`;
    this.iframeURL = `${this.baseURL}/_static/connect.html`;
  }

  connectAccount(opts: StartConnectOpts) {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== this.baseURL || !this.iframe?.contentWindow) {
        console.warn("Untrusted origin or iframe not ready:", e.origin);
        return;
      }

      switch (e.data?.type) {
      case "verify-domain":
        this.handleVerifyDomain(e);
        break;
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
        console.debug("Unknown Connect Event type", e);
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

  private handleVerifyDomain(e: MessageEvent) {
    if (this.iframe?.contentWindow) {
      this.iframe.contentWindow.postMessage(
        {
          type: "domain-response",
          origin: window.origin,
        },
        e.origin,
      );
    }
  }

  private cleanup(onMessage: (e: MessageEvent) => void) {
    this.iframe?.remove();
    window.removeEventListener("message", onMessage);
  }

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
