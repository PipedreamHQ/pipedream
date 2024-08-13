var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
class ConnectError extends Error {
}
export function createClient(opts) {
    return new BrowserClient(opts);
}
class BrowserClient {
    constructor(opts) {
        this.iframeId = 0;
        this.environment = opts.environment;
        this.publicKey = opts.publicKey;
        this.baseURL = `https://${opts.frontendHost || "pipedream.com"}`;
        this.iframeURL = `${this.baseURL}/_static/connect.html`;
    }
    startConnect(opts) {
        const onMessage = (e) => {
            var _a, _b, _c, _d, _e;
            switch ((_a = e.data) === null || _a === void 0 ? void 0 : _a.type) {
                case "verify-domain":
                    // The Application should respond with it's domain to the iframe for security
                    console.log("Sending Response to", e.origin);
                    (_b = e.source) === null || _b === void 0 ? void 0 : _b.postMessage({ type: "domain-response", origin: window.origin }, { targetOrigin: e.origin });
                    break;
                case "success":
                    const _f = e.data, { authProvisionId: id } = _f, rest = __rest(_f, ["authProvisionId"]);
                    console.log("SUCCESS!!!", e);
                    (_c = opts.onSuccess) === null || _c === void 0 ? void 0 : _c.call(opts, Object.assign({ id }, rest));
                    break;
                case "error":
                    // Return the error to the parent if there was a problem with the Authorization
                    console.log("ERROR!!!", e);
                    (_d = opts.onError) === null || _d === void 0 ? void 0 : _d.call(opts, new ConnectError(e.data.error));
                    break;
                case "close":
                    console.log("CLOSE!!!", e);
                    (_e = this.iframe) === null || _e === void 0 ? void 0 : _e.remove();
                    window.removeEventListener("message", onMessage);
                    break;
                default:
                    console.debug('Unknown Connect Event type', e);
                    break;
            }
        };
        window.addEventListener("message", onMessage);
        const qp = new URLSearchParams();
        qp.set("token", opts.token);
        if (this.environment) {
            qp.set("environment", this.environment);
        }
        qp.set("public_key", this.publicKey || process.env.PIPEDREAM_PROJECT_PUBLIC_KEY);
        if (typeof opts.app === "string") {
            qp.set("app", opts.app);
        }
        else {
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
        iframe.setAttribute("style", "position:fixed;inset:0;z-index:2147483647;border:0;display:block;overflow:hidden auto");
        iframe.setAttribute("height", "100%");
        iframe.setAttribute("width", "100%");
        document.body.appendChild(iframe);
        this.iframe = iframe;
    }
}
