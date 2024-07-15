type CreateServerClientOpts = {
  environment?: string;
  secretKey: string;
  apiHost?: string;
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
  baseURL: string;

  constructor(opts: CreateServerClientOpts) {
    this.environment = opts.environment;
    this.secretKey = opts.secretKey;
    this.baseURL = `https://${opts.apiHost || "pipedream.com"}`;
  }

  private _authorizationHeader(): string {
    return "Basic " + Buffer.from(this.secretKey + ":").toString("base64");
  }

  // XXX move to REST API endpoint
  async connectTokenCreate(opts: ConnectTokenCreateOpts): Promise<string> {
    const variables = {
      secretKey: this.secretKey,
      clientUserId: opts.clientUserId,
    }
    const resp = await fetch(`${this.baseURL}/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation sdkConnectTokenCreate(
          $projectId: String!
          $secretKey: String!
          $clientUserId: String!
        ) {
          connectTokenCreate(
            projectId: $projectId
            secretKey: $secretKey
            clientUserId: $clientUserId
          ) {
            token
          }
        }`,
        variables,
      }),
    });
    const res = await resp.json();
    if(res.errors?.length) {
      throw new Error(res.errors[0])
    }
    // XXX expose error here
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
      url = `${baseAccountURL}?app=${key.app}&limit=100&client_user_id=${key.clientUserId}`;
    }
    if (opts?.includeCredentials) {
      url += `${id
        ? "?"
        : "&"}include_credentials=1`;
    }
    const resp = await fetch(url, {
      headers: {
        Authorization: this._authorizationHeader(),
      },
    });
    const res = await resp.json();
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
