type CreateServerClientOpts = {
  environment?: string;
  secretKey: string;
  apiHost?: string;
  //projectId?: string;
  publicKey: string;
};

type ConnectTokenCreateOpts = {
  clientUserId: string;
};

type AccountId = string;
type AccountKeyFields = {
  clientUserId: string;
  app: string;
};
type AccountKey = AccountId | AccountKeyFields;

export function createClient(opts: CreateServerClientOpts) {
  return new ServerClient(opts);
}

class ServerClient {
  environment?: string;
  secretKey: string;
  publicKey: string;
  //projectId: string;
  baseURL: string;

  constructor(opts: CreateServerClientOpts) {
    this.environment = opts.environment;
    this.secretKey = opts.secretKey;
    this.publicKey = opts.publicKey;
    //this.projectId = opts.projectId;
    this.baseURL = `https://${opts.apiHost || "pipedream.com"}`;
  }

  private _authorizonHeader(): string {
    return "Basic " + Buffer.from(`${this.publicKey}:${this.secretKey}`).toString("base64");
  }

  // XXX move to REST API endpoint
  async connectTokenCreate(opts: ConnectTokenCreateOpts): Promise<string> {
    const resp = await fetch(`${this.baseURL}/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation sdkConnectTokenCreate(
          $publicKey: String!
          $secretKey: String!
          $externalId: String!
          $oauthAppId: String!
        ) {
          connectTokenCreate(
            publicKey: $publicKey
            secretKey: $secretKey
            externalId: $externalId
            oauthAppId: $oauthAppId
          ) {
            token
          }
        }`,
        variables: {
          publicKey: this.publicKey,
          secretKey: this.secretKey,
          externalId: opts.clientUserId,
          oauthAppId: "oa_aLZiMJ",
        },
      }),
    });
    const res = await resp.json();
    // XXX expose error here
    console.log("connect token create result")
    console.log(res)
    return res.data?.connectTokenCreate?.token;
  }

  async getAccount(key: AccountKey, opts?: { includeCredentials?: boolean; }) {
    let url: string;
    let id: string | undefined;
    const baseAccountURL = `${this.baseURL}/v1/accounts`;
    if (typeof key === "string") {
      id = key;
      url = `${baseAccountURL}/${id}`;
    } else {
      url = `${baseAccountURL}?app=${key.app}&limit=100&external_id=${key.clientUserId}`;
    }
    if (opts?.includeCredentials) {
      url += `${id
        ? "?"
        : "&"}include_credentials=1`;
    }
    const resp = await fetch(url, {
      headers: {
        Authorization: this._authorizonHeader(),
      },
    });
    const res = await resp.json();
    console.log('res :>> ', res);
    const {
      data, error,
    } = res;
    if (error) {
      if (error === "record not found") {
        return null;
      }
      throw new Error(error);
    }
    return data;
  }
}
