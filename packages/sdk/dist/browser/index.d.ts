type CreateBrowserClientOpts = {
    environment?: string;
    frontendHost?: string;
    publicKey: string;
};
type AppId = string;
type StartConnectApp = {
    id: AppId;
};
type ConnectResult = {};
declare class ConnectError extends Error {
}
type StartConnectOpts = {
    token: string;
    app: AppId | StartConnectApp;
    onSuccess?: (res: ConnectResult) => void;
    onError?: (err: ConnectError) => void;
};
export declare function createClient(opts: CreateBrowserClientOpts): BrowserClient;
declare class BrowserClient {
    environment?: string;
    baseURL: string;
    publicKey: string;
    iframeURL: string;
    iframe?: HTMLIFrameElement;
    iframeId: number;
    constructor(opts: CreateBrowserClientOpts);
    startConnect(opts: StartConnectOpts): void;
}
export {};
