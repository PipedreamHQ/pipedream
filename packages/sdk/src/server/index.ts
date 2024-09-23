// This code is meant to be run server-side, where you can securely store your
// Pipedream project's public and secret keys and access customer credentials.
// See the browser/ directory for the browser client.

import {
  AccessToken,
  ClientCredentials,
} from "simple-oauth2";

/**
 * Options for creating a server-side client.
 * This is used to configure the ServerClient instance.
 */
export type CreateServerClientOpts = {
  /**
   * The environment in which the server is running (e.g., "production", "development").
   */
  environment?: string;

  /**
   * The public API key for accessing the service. This key is required.
   */
  publicKey: string;

  /**
   * The secret API key for accessing the service. This key is required.
   */
  secretKey: string;

  /**
   * The client ID of your workspace's OAuth application.
   */
  oauthClientId?: string;

  /**
   * The client secret of your workspace's OAuth application.
   */
  oauthClientSecret?: string;

  /**
   * The API host URL. Used by Pipedream employees. Defaults to "api.pipedream.com" if not provided.
   */
  apiHost?: string;
};

/**
 * Options for creating a Connect token.
 */
export type ConnectTokenCreateOpts = {
  /**
   * https://pipedream.com/docs/connect/quickstart#find-your-apps-name-slug
   */
  app_slug: string;

  /**
   * Pass for OAuth apps. See https://pipedream.com/docs/connect/quickstart#creating-a-custom-oauth-client
   */
  oauth_app_id?: string;

  /**
   * An external user ID associated with the token.
   */
  external_user_id: string;
};

export type AppInfo = {
  /**
   * ID of the app. Only applies for Oauth apps.
   */
  id?: string;

  /**
   * https://pipedream.com/docs/connect/quickstart#find-your-apps-name-slug
   */
  name_slug: string;
};

/**
 * Response received after requesting project info.
 */
export type ProjectInfoResponse = {
  /**
   * An array of apps linked to the project.
   */
  apps: AppInfo[];
};

/**
 * Response received after creating a connect token.
 */
export type ConnectTokenResponse = {
  /**
   * The generated token.
   */
  token: string;

  /**
   * The expiration time of the token in ISO 8601 format.
   */
  expires_at: string;
};

/**
 * Parameters for the Connect API.
 */
export type ConnectParams = {
  /**
   * Whether to include credentials in the request (1 to include, 0 to exclude).
   */
  include_credentials?: number;
};

/**
 * The authentication type for the app.
 */
export type AuthType = "oauth" | "keys" | "none";

/**
 * Response object for Pipedream app metadata
 */
export type AppResponse = {
  /**
   * The unique ID of the app.
   */
  id: string;

  /**
   * https://pipedream.com/docs/connect/quickstart#find-your-apps-name-slug
   */
  name_slug: string;

  /**
   * The human-readable name of the app.
   */
  name: string;

  /**
   * The authentication type used by the app.
   */
  auth_type: AuthType;

  /**
   * The URL to the app's logo.
   */
  img_src: string;

  /**
   * A JSON string representing the custom fields for the app.
   */
  custom_fields_json: string;

  /**
   * Categories associated with the app.
   */
  categories: string[];
};

/**
 * Options for creating a connected account.
 */
export type CreateAccountOpts = {
  /**
   * https://pipedream.com/docs/connect/quickstart#find-your-apps-name-slug
   */
  app_slug: string;

  /**
   * The connect token used to authenticate the account creation.
   */
  connect_token: string;

  /**
   * A JSON string representing a map of custom fields for the account.
   */
  cfmap_json: string;

  /**
   * The name of the account.
   */
  name?: string;
};

/**
 * End user account data, returned from the API.
 */
export type Account = {
  /**
   * The unique ID of the account.
   */
  id: string;

  /**
   * The name of the account.
   */
  name: string;

  /**
   * The external ID associated with the account.
   */
  external_id: string;

  /**
   * Indicates if the account is healthy. Pipedream will periodically retry token refresh and test requests for unhealthy accounts.
   */
  healthy: boolean;

  /**
   * Indicates if the account is no longer active.
   */
  dead: boolean;

  /**
   * The app associated with the account.
   */
  app: AppResponse;

  /**
   * The date and time the account was created, an ISO 8601 formatted string.
   */
  created_at: string;

  /**
   * The date and time the account was last updated, an ISO 8601 formatted string.
   */
  updated_at: string;

  /**
   * The credentials associated with the account, if `include_credentials` was true.
   */
  credentials?: Record<string, string>;
};

/**
 * Error response returned by the API in case of an error.
 */
export type ErrorResponse = {
  /**
   * The error message returned by the API.
   */
  error: string;
};

/**
 * A generic API response that can either be a success or an error.
 */
export type ConnectAPIResponse<T> = T | ErrorResponse;

/**
 * Options for making a request to the Pipedream API.
 */
interface RequestOptions extends Omit<RequestInit, "headers"> {
  /**
   * Query parameters to include in the request URL.
   */
  params?: Record<string, string | boolean | number>;

  /**
   * Headers to include in the request.
   */
  headers?: Record<string, string>;

  /**
   * The URL to make the request to.
   */
  baseURL?: string;
}

/**
 * Creates a new instance of `ServerClient` with the provided options.
 *
 * @example
 * ```typescript
 * const client = createClient({
 *   publicKey: "your-public-key",
 *   secretKey: "your-secret-key",
 * });
 * ```
 * @param opts - The options for creating the server client.
 * @returns A new instance of `ServerClient`.
 */
export function createClient(opts: CreateServerClientOpts) {
  return new ServerClient(opts);
}

/**
 * A client for interacting with the Pipedream Connect API on the server-side.
 */
class ServerClient {
  environment?: string;
  secretKey: string;
  publicKey: string;
  oauthClient?: ClientCredentials;
  oauthToken?: AccessToken;
  baseURL: string;

  /**
   * Constructs a new `ServerClient` instance.
   *
   * @param opts - The options for configuring the server client.
   */
  constructor(opts: CreateServerClientOpts) {
    this.environment = opts.environment;
    this.secretKey = opts.secretKey;
    this.publicKey = opts.publicKey;

    const { apiHost = "api.pipedream.com" } = opts;
    this.baseURL = `https://${apiHost}/v1`;

    this._configureOauthClient(opts, this.baseURL);
  }

  private _configureOauthClient(
    {
      oauthClientId: id,
      oauthClientSecret: secret,
    }: CreateServerClientOpts,
    tokenHost: string,
  ) {
    if (!id || !secret) {
      return;
    }

    this.oauthClient = new ClientCredentials({
      client: {
        id,
        secret,
      },
      auth: {
        tokenHost,
        tokenPath: "/v1/oauth/token",
      },
    });
  }

  /**
   * Generates an Authorization header for Connect using the public and secret
   * keys of the target project.
   *
   * @returns The authorization header as a string.
   */
  private _connectAuthorizationHeader(): string {
    const encoded = Buffer.from(`${this.publicKey}:${this.secretKey}`).toString("base64");
    return `Basic ${encoded}`;
  }

  async _oauthAuthorizationHeader(): Promise<string> {
    if (!this.oauthClient) {
      throw new Error("OAuth client not configured");
    }

    if (!this.oauthToken || this.oauthToken.expired()) {
      this.oauthToken = await this.oauthClient.getToken({});
    }

    return `Bearer ${this.oauthToken.token.access_token}`;
  }

  /**
   * Makes an HTTP request
   *
   * @template T - The expected response type.
   * @param path - The API endpoint path.
   * @param opts - The options for the request.
   * @returns A promise resolving to the API response.
   * @throws Will throw an error if the response status is not OK.
   */
  async _makeRequest<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const {
      params,
      headers: customHeaders,
      body,
      method = "GET",
      baseURL = this.baseURL,
      ...fetchOpts
    } = opts;
    const url = new URL(`${baseURL}${path}`);

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
      "Content-Type": "application/json",
      ...customHeaders,
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      ...fetchOpts,
    };

    if ([
      "POST",
      "PUT",
      "PATCH",
    ].includes(method.toUpperCase()) && body) {
      requestOptions.body = body;
    }

    const response: Response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json() as unknown as T;
    return result;
  }

  /**
   * Makes a request to the Pipedream API.
   *
   * @template T - The expected response type.
   * @param path - The API endpoint path.
   * @param opts - The options for the request.
   * @returns A promise resolving to the API response.
   * @throws Will throw an error if the response status is not OK.
   */
  async _makeApiRequest<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const headers = {
      ...opts.headers ?? {},
      "Authorization": await this._oauthAuthorizationHeader(),
    };
    return this._makeRequest<T>(path, {
      headers,
      ...opts,
    });
  }

  /**
   * Makes a request to the Connect API.
   *
   * @template T - The expected response type.
   * @param path - The API endpoint path.
   * @param opts - The options for the request.
   * @returns A promise resolving to the API response.
   * @throws Will throw an error if the response status is not OK.
   */
  async _makeConnectRequest<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const headers = {
      ...opts.headers ?? {},
      "Authorization": this._connectAuthorizationHeader(),
    };
    return this._makeRequest<T>(`/connect${path}`, {
      headers,
      ...opts,
    });
  }

  /**
   * Creates a new connect token.
   *
   * @param opts - The options for creating the connect token.
   * @returns A promise resolving to the connect token response.
   *
   * @example
   * ```typescript
   * const tokenResponse = await client.connectTokenCreate({
   *   app_slug: "your-app-slug",
   *   external_user_id: "external-user-id",
   * });
   * console.log(tokenResponse.token);
   * ```
   */
  async connectTokenCreate(opts: ConnectTokenCreateOpts): Promise<ConnectTokenResponse> {
    const body = {
      // Named external_id in the API, but from the developer's perspective, it's the user's ID
      external_id: opts.external_user_id,
      ...opts,
    };
    return this._makeConnectRequest<ConnectTokenResponse>("/tokens", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  /**
   * Retrieves a list of accounts.
   *
   * @param params - The query parameters for retrieving accounts.
   * @returns A promise resolving to a list of accounts.
   *
   * @example
   * ```typescript
   * const accounts = await client.getAccounts({ include_credentials: 1 });
   * console.log(accounts);
   * ```
   */
  async getAccounts(params: ConnectParams = {}): Promise<Account[]> {
    return this._makeConnectRequest<Account[]>("/accounts", {
      params,
    });
  }

  /**
   * Retrieves a specific account by ID.
   *
   * @param accountId - The ID of the account to retrieve.
   * @param params - The query parameters for retrieving the account.
   * @returns A promise resolving to the account.
   *
   * @example
   * ```typescript
   * const account = await client.getAccount("account-id");
   * console.log(account);
   * ```
   */
  async getAccount(accountId: string, params: ConnectParams = {}): Promise<Account> {
    return this._makeConnectRequest<Account>(`/accounts/${accountId}`, {
      params,
    });
  }

  /**
   * Retrieves accounts associated with a specific app.
   *
   * @param appId - The ID of the app.
   * @param params - The query parameters for retrieving accounts.
   * @returns A promise resolving to a list of accounts.
   *
   * @example
   * ```typescript
   * const accounts = await client.getAccountsByApp("app-id");
   * console.log(accounts);
   * ```
   */
  async getAccountsByApp(appId: string, params: ConnectParams = {}): Promise<Account[]> {
    return this._makeConnectRequest<Account[]>(`/accounts/app/${appId}`, {
      params,
    });
  }

  /**
   * Retrieves accounts associated with a specific external ID.
   *
   * @param externalId - The external ID associated with the accounts.
   * @param params - The query parameters for retrieving accounts.
   * @returns A promise resolving to a list of accounts.
   *
   * @example
   * ```typescript
   * const accounts = await client.getAccountsByExternalId("external-id");
   * console.log(accounts);
   * ```
   */
  async getAccountsByExternalId(externalId: string, params: ConnectParams = {}): Promise<Account[]> {
    return this._makeConnectRequest<Account[]>(`/accounts/external_id/${externalId}`, {
      params,
    });
  }

  /**
   * Deletes a specific account by ID.
   *
   * @param accountId - The ID of the account to delete.
   * @returns A promise resolving when the account is deleted.
   *
   * @example
   * ```typescript
   * await client.deleteAccount("account-id");
   * console.log("Account deleted");
   * ```
   */
  async deleteAccount(accountId: string): Promise<void> {
    await this._makeConnectRequest(`/accounts/${accountId}`, {
      method: "DELETE",
    });
  }

  /**
   * Deletes all accounts associated with a specific app.
   *
   * @param appId - The ID of the app.
   * @returns A promise resolving when all accounts are deleted.
   *
   * @example
   * ```typescript
   * await client.deleteAccountsByApp("app-id");
   * console.log("All accounts deleted");
   * ```
   */
  async deleteAccountsByApp(appId: string): Promise<void> {
    await this._makeConnectRequest(`/accounts/app/${appId}`, {
      method: "DELETE",
    });
  }

  /**
   * Deletes all accounts associated with a specific external ID.
   *
   * @param externalId - The external ID associated with the accounts.
   * @returns A promise resolving when all accounts are deleted.
   *
   * @example
   * ```typescript
   * await client.deleteExternalUser("external-id");
   * console.log("All accounts deleted");
   * ```
   */
  async deleteExternalUser(externalId: string): Promise<void> {
    await this._makeConnectRequest(`/users/${externalId}`, {
      method: "DELETE",
    });
  }

  async getProjectInfo(): Promise<ProjectInfoResponse> {
    return this._makeConnectRequest<ProjectInfoResponse>("/projects/info", {
      method: "GET",
    });
  }

  /**
   * Invokes a workflow using the URL of its HTTP interface(s), by sending an
   * HTTP POST request with the provided body.
   *
   * @param url - The URL of the workflow's HTTP interface.
   * @param opts - The options for the request.
   * @param opts.body - The body of the request. It must be a JSON-serializable
   * value (e.g. an object, `null`, a string, etc.).
   * @param opts.headers - The headers to include in the request. Note that the
   * `Authorization` header will always be set with an OAuth access token
   * retrieved by the client.
   *
   * @returns A promise resolving to the response from the workflow.
   *
   * @example
   * ```typescript
   * const response: JSON = await client.invokeWorkflow(
   *   "https://eoy64t2rbte1u2p.m.pipedream.net",
   *   {
   *     body: {
   *       foo: 123,
   *       bar: "abc",
   *       baz: null,
   *     },
   *     headers: {
   *       "Accept": "application/json",
   *     },
   *   },
   * );
   */
  async invokeWorkflow(url: string, opts: RequestOptions = {}): Promise<unknown> {
    const {
      body = null,
      headers = {},
    } = opts;

    return this._makeRequest("", {
      baseURL: url,
      method: "POST",
      headers: {
        ...headers,
        "Authorization": await this._oauthAuthorizationHeader(),
      },
      body: JSON.stringify(body),
    });
  }
}
