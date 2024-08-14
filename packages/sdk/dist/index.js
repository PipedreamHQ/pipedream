var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function createClient(opts) {
    return new ServerClient(opts);
}
class ServerClient {
    constructor(opts) {
        this.environment = opts.environment;
        this.secretKey = opts.secretKey;
        this.publicKey = opts.publicKey;
        const { apiHost = "pipedream.com" } = opts;
        this.baseURL = `https://${apiHost}`;
    }
    _authorizationHeader() {
        const encoded = Buffer
            .from(`${this.publicKey}:${this.secretKey}`)
            .toString("base64");
        return `Basic ${encoded}`;
    }
    // XXX move to REST API endpoint
    connectTokenCreate(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = this._authorizationHeader();
            const resp = yield fetch(`${this.baseURL}/v1/connect/tokens`, {
                method: "POST",
                headers: {
                    "authorization": auth,
                    "content-type": "application/json",
                },
                body: JSON.stringify(opts),
            });
            const res = yield resp.json();
            // XXX expose error here
            return res === null || res === void 0 ? void 0 : res.token;
        });
    }
    getAccount(key, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            let url;
            let id;
            const baseAccountURL = `${this.baseURL}/v1/accounts`;
            if (typeof key === "string") {
                id = key;
                url = `${baseAccountURL}/${id}`;
            }
            else {
                url = `${baseAccountURL}?app=${key.appId}&limit=100&external_id=${key.externalId}`;
            }
            if (opts === null || opts === void 0 ? void 0 : opts.includeCredentials) {
                url += `${id
                    ? "?"
                    : "&"}include_credentials=1`;
            }
            const resp = yield fetch(url, {
                headers: {
                    Authorization: this._authorizationHeader(),
                },
            });
            const res = yield resp.json();
            const { data, error, } = res;
            if (error) {
                if (error === "record not found") {
                    return null;
                }
                throw new Error(error);
            }
            return data;
        });
    }
}
