type CreateServerClientOpts = {
  environment?: string;
  secretKey: string;
  apiHost?: string;
  projectId: string;
};

type ConnectTokenCreateOpts = {
  externalId: string;
  clientName?: string
};

// type AccountId = string;
// type AccountKeyFields = {
//   externalId: string;
//   app: string;
// };
// type AccountKey = AccountId | AccountKeyFields;

export function createClient(opts: CreateServerClientOpts) {
  return new ServerClient(opts);
}

class ServerClient {
  environment?: string;
  secretKey: string;
  projectId: string;
  baseURL: string;

  constructor(opts: CreateServerClientOpts) {
    this.environment = opts.environment;
    this.secretKey = opts.secretKey;
    this.projectId = opts.projectId;
    this.baseURL = `https://${opts.apiHost || "pipedream.com"}`;
  }

  // XXX move to REST API endpoint
  async connectTokenCreate(opts: ConnectTokenCreateOpts): Promise<string> {
    const variables = {
      projectId: this.projectId,
      secretKey: this.secretKey,
      externalId: opts.externalId,
      clientName: opts.clientName ?? "MyApplication"
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
          $clientName: String!
          $externalId: String!
        ) {
          connectTokenCreate(
            projectId: $projectId
            secretKey: $secretKey
            clientName: $clientName
            externalId: $externalId
          ) {
            token
          }
        }`,
        variables,
      }),
    });
    const res = await resp.json();
    if (res.errors?.length) {
      throw res.errors[0]
    }
    return res.data?.connectTokenCreate?.token;
  }

  async getAccount(opts: { authProvisionId: string; projectId: string; }) {
    const url = `${this.baseURL}/v1/accounts?id=${opts.authProvisionId}&include_credentials=1`;
    const Authorization = "Basic " + Buffer.from(opts.projectId + ":" + this.secretKey).toString("base64")

    const resp = await fetch(url, {
      headers: {
        Authorization,
      },
    });

    const { data, error } = await resp.json();
    if (error) {
      if (error === "record not found") return null;
      throw new Error(error);
    }
    return data;
  }
}
