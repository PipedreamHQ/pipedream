type CreateBrowserClientOpts = {
  publicKey: string;
  frontendHost?: string;
};



type ConnectResult = {
  authProvisionId: string
};

class ConnectError extends Error { }

type StartConnectOpts = {
  token: string;
  oauthAppId: string;
  onSuccess?: (res: ConnectResult) => void;
  onError?: (err: ConnectError) => void;
};

export function createClient(opts: CreateBrowserClientOpts) {
  return new BrowserClient(opts);
}

class BrowserClient {
  publicKey: string;
  baseURL: string;
  iframeURL: string;
  iframe?: HTMLIFrameElement;
  iframeId = 0;

  constructor(opts: CreateBrowserClientOpts) {
    this.publicKey = opts.publicKey;
    this.baseURL = `https://${opts.frontendHost || "pipedream.com"}`;
    this.iframeURL = `${this.baseURL}/_static/connect.html`;
  }

  startConnect(opts: StartConnectOpts) {
    const onMessage = (e: MessageEvent) => {
      switch (e.data?.type) {
        case "verify-domain":
          // The Application should respond with it's domain to the iframe for security
          e.source?.postMessage(
            { type: "domain-response", origin: window.origin }, { targetOrigin: e.origin }
          )
          break;
        case "success":
          // We got a Successful Authorization
          // We can return the Auth Provision ID to the parent.
          // The parent can then use that auth provision id to query for the Account information
          opts.onSuccess?.(e.data)
          break;
        case "error":
          // Return the error to the parent if there was a problem with the Authorization
          opts.onError?.(new ConnectError(e.data.error))
          break;
        case "close":
          // Final case, where we close the window and remove the handler
          this.iframe?.remove()
          window.removeEventListener("message", onMessage)
          break;
        default:
          console.info('Unknown Connect Event type', e)
          break;
      }
    }
    window.addEventListener("message", onMessage)

    const qp = new URLSearchParams()
    qp.set("public_key", this.publicKey)
    qp.set("token", opts.token)
    qp.set("app", opts.oauthAppId)

    const iframe = document.createElement("iframe")
    iframe.id = `pipedream-connect-iframe-${this.iframeId++}`
    iframe.title = "Pipedream Connect"
    iframe.src = `${this.iframeURL}?${qp.toString()}`
    iframe.setAttribute(
      "style",
      "position:fixed;inset:0;z-index:2147483647;border:0;display:block;overflow:hidden auto",
    )
    iframe.setAttribute("height", "100%")
    iframe.setAttribute("width", "100%")

    document.body.appendChild(iframe)
    this.iframe = iframe
  }
}
