type CreateServerClientOpts = {
  environment?: string;
  secretKey: string;
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

const API_BASE_URL = "https://api.dylburger.gkes.pipedream.net";

class ServerClient {
  environment?: string;
  secretKey: string;

  constructor(opts: CreateServerClientOpts) {
    this.environment = opts.environment;
    this.secretKey = opts.secretKey;
  }

  private _authorizonHeader(): string {
    return "Basic " + Buffer.from(this.secretKey + ":").toString("base64");
  }

  // XXX move to REST API endpoint
  async connectTokenCreate(opts: ConnectTokenCreateOpts): Promise<string> {
    const resp = await fetch(`${API_BASE_URL}/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `mutation sdkConnectTokenCreate(
          $secretKey: String!
          $clientName: String!
          $clientUserId: String!
        ) {
          connectTokenCreate(
            secretKey: $secretKey
            clientName: $clientName
            clientUserId: $clientUserId
          ) {
            token
          }
        }`,
        variables: {
          secretKey: this.secretKey,
          clientUserId: opts.clientUserId,
        },
      }),
    });
    const res = await resp.json();
    // XXX expose error here
    return res.data?.connectTokenCreate?.token;
  }

  async getAccount(key: AccountKey, opts?: { includeCredentials?: boolean; }) {
    let url: string;
    let id: string | undefined;
    if (typeof key === "string") {
      id = key;
      url = `${API_BASE_URL}/v1/accounts/${id}`;
    } else {
      url = `${API_BASE_URL}/v1/accounts?app=${key.app}&client_user_id=${key.clientUserId}`;
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
    if (id) {
      return res.data;
    }
    return res.data.accounts[0];
  }
}
