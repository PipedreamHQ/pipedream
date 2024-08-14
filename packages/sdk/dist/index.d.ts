type CreateServerClientOpts = {
    apiHost?: string;
    environment?: string;
    publicKey: string;
    secretKey: string;
};
export type ConnectTokenCreateOpts = {
    app_id: string;
    client_name?: string;
    external_id: string;
};
type AccountId = string;
type AccountKeyFields = {
    externalId: string;
    appId: string;
};
type AccountKey = AccountId | AccountKeyFields;
export declare function createClient(opts: CreateServerClientOpts): ServerClient;
declare class ServerClient {
    environment?: string;
    secretKey: string;
    publicKey: string;
    baseURL: string;
    constructor(opts: CreateServerClientOpts);
    private _authorizationHeader;
    connectTokenCreate(opts: ConnectTokenCreateOpts): Promise<string>;
    getAccount(key: AccountKey, opts?: {
        includeCredentials?: boolean;
    }): Promise<any>;
}
export {};
