type CreateServerClientOpts = {
  apiHost?: string;
  environment?: string;
  publicKey: string;
  secretKey: string;
};

export type ConnectTokenCreateOpts = {
  app_slug: string;
  oauth_app_id?: string;
  external_user_id: string;
};

export type ConnectTokenResponse = {
  token: string;
  expires_at: string;
};

type ConnectParams = {
  include_credentials?: number;
};

type AuthType = "oauth" | "keys" | "none";

type AppResponse = {
  id: string;
  name_slug: string;
  name: string;
  auth_type: AuthType;
  img_src: string;
  custom_fields_json: string;
  categories: string[];

};

type CreateAccountOpts = {
  app_slug: string;
  connect_token: string;
  cfmap_json: string;
  name?: string;
};

// Updated Account type to include optional fields
type Account = {
  id: string;
  name: string;
  external_id: string;
  healthy: boolean;
  dead: boolean;
  app: AppResponse;
  created_at: string;
  updated_at: string;
  credentials?: Record<string, string>; // Optional field for when include_credentials is true
};

interface SuccessResponse<T> {
  status: "success";
  data: T;
}

type ErrorResponse = {
  error: string;
};

type ConnectAPIResponse<T> = SuccessResponse<T> | ErrorResponse;

interface ConnectRequestOptions extends Omit<RequestInit, "headers"> {
  params?: Record<string, string | boolean | number>;
  headers?: Record<string, string>;
}

export function createClient(opts: CreateServerClientOpts) {
  return new ServerClient(opts);
}

class ServerClient {
  environment?: string;
  secretKey: string;
  publicKey: string;
  baseURL: string;

  constructor(opts: CreateServerClientOpts) {
    this.environment = opts.environment;
    this.secretKey = opts.secretKey;
    this.publicKey = opts.publicKey;

    const { apiHost = "api.pipedream.com" } = opts;
    this.baseURL = `https://${apiHost}/v1`;
  }

  private _authorizationHeader(): string {
    const encoded = Buffer
      .from(`${this.publicKey}:${this.secretKey}`)
      .toString("base64");
    return `Basic ${encoded}`;
  }

  async _makeConnectRequest<T>(
    path: string,
    opts: ConnectRequestOptions = {},
  ): Promise<ConnectAPIResponse<T>> {
    const {
      params,
      headers: customHeaders,
      body,
      method = "GET",
      ...fetchOpts
    } = opts;
    const url = new URL(`${this.baseURL}/connect${path}`);

    if (params) {
      Object.entries(params).forEach(([
        key,
        value,
      ]) => {
        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    const headers = {
      "Authorization": this._authorizationHeader(),
      "Content-Type": "application/json",
      ...customHeaders,
    };

    // Prepare the request options
    const requestOptions: RequestInit = {
      method,
      headers,
      ...fetchOpts,
    };

    // Handle body for POST, PUT, PATCH requests
    if ([
      "POST",
      "PUT",
      "PATCH",
    ].includes(method.toUpperCase()) && body) {
      requestOptions.body = body;
    }

    console.log(`Making request to ${url.toString()}`);
    console.log(`Request options: ${JSON.stringify(requestOptions)}`);

    const response: Response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ConnectAPIResponse<T> = await response.json();
    return result;
  }

  async connectTokenCreate(opts: ConnectTokenCreateOpts): Promise<ConnectAPIResponse<ConnectTokenResponse>> {
    const body = {
      // named external_id in the API, but from the developer's perspective, it's the user's ID
      external_id: opts.external_user_id,
      ...opts,
    };
    return this._makeConnectRequest<ConnectTokenResponse>("/tokens", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async getAccounts(params: ConnectParams = {}): Promise<ConnectAPIResponse<Account[]>> {
    return this._makeConnectRequest<Account[]>("/accounts", {
      params,
    });
  }

  async getAccount(accountId: string, params: ConnectParams = {}): Promise<ConnectAPIResponse<Account>> {
    return this._makeConnectRequest<Account>(`/accounts/${accountId}`, {
      params,
    });
  }

  async getAccountsByApp(appId: string, params: ConnectParams = {}): Promise<ConnectAPIResponse<Account[]>> {
    return this._makeConnectRequest<Account[]>(`/accounts/app/${appId}`, {
      params,
    });
  }

  async getAccountsByExternalId(externalId: string, params: ConnectParams = {}): Promise<ConnectAPIResponse<Account[]>> {
    return this._makeConnectRequest<Account[]>(`/accounts/external_id/${externalId}`, {
      params,
    });
  }

  async createAccount(opts: CreateAccountOpts): Promise<ConnectAPIResponse<Account>> {
    return this._makeConnectRequest<Account>("/accounts", {
      method: "POST",
      body: JSON.stringify(opts),
    });
  }

  async deleteAccount(accountId: string): Promise<void> {
    await this._makeConnectRequest(`/accounts/${accountId}`, {
      method: "DELETE",
    });
  }

  async deleteAccountsByApp(appId: string): Promise<void> {
    await this._makeConnectRequest(`/accounts/app/${appId}`, {
      method: "DELETE",
    });
  }
}
