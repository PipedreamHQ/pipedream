// This code is meant to be run server-side, where you can securely store your
// Pipedream project's public and secret keys and access customer credentials.
// See the browser/ directory for the browser client.

import * as oauth from "oauth4webapi";
import {
  Account, BaseClient, type AppInfo, type ConnectTokenResponse, type RequestOptions,
} from "../shared/index.js";
export * from "../shared/index.js";

/**
 * OAuth credentials for your Pipedream account, containing client ID and
 * secret.
 */
export type OAuthCredentials = {
  clientId: string;
  clientSecret: string;
};

/**
 * The environment in which the server client is running.
 */
export type ProjectEnvironment = "development" | "production";

/**
 * Options for creating a server-side client.
 * This is used to configure the ServerClient instance.
 */
export type BackendClientOpts = {
  /**
   * The environment in which the server client is running (e.g., "production",
   * "development").
   */
  environment?: ProjectEnvironment;

  /**
   * The credentials to use for authentication against the Pipedream API.
   */
  credentials: OAuthCredentials;

  /**
   * The base project ID tied to relevant API requests
   */
  projectId: string;

  /**
   * The API host URL. Used by Pipedream employees. Defaults to
   * "api.pipedream.com" if not provided.
   */
  apiHost?: string;

  /**
   * Base domain for workflows. Used for custom domains:
   * https://pipedream.com/docs/workflows/domains
   */
  workflowDomain?: string;
};

/**
 * Options for creating a Connect token.
 */
export type ConnectTokenCreateOpts = {
  /**
   * The ID of the user in your system.
   */
  external_user_id: string;

  /**
   * The optional url to redirect the user to upon successful connection.
   */
  success_redirect_uri?: string;

  /**
   * The optional url to redirect the user to upon failed connection.
   */
  error_redirect_uri?: string;

  /**
   * An optional webhook uri that Pipedream can invoke on success or failure of
   * connection requests.
   */
  webhook_uri?: string;

  /**
   * Specify which origins can use the token to call the Pipedream API.
   */
  allowed_origins?: string[];
};

/**
 * Response received after requesting a project's info.
 */
export type ProjectInfoResponse = {
  /**
   * An array of apps linked to the project.
   */
  apps: AppInfo[];
};

/**
 * Parameters for the retrieval of an account from the Connect API
 */
export type GetAccountByIdOpts = {
  /**
   * Whether to retrieve the account's credentials or not.
   */
  include_credentials?: boolean;
};

/**
 * Options used to determine the external user and account to be used in Connect Proxy API
 */
export type ProxyApiOpts  = {
  /**
   * Search parameters to be added to the proxy request.  external_user_id and account_id are required.
   */
  searchParams: Record<string, string>;
};

/**
 * fetch-like options for the Target of the Connect Proxy Api Request
 */
export type ProxyTargetApiOpts = {
  /**
   * http method for the request
   */
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /**
   * http headers for the request
   */
  headers?: Record<string, string>;
  /**
   * http body for the request
   */
  body?: string;
};

/**
 * object that contains the url and options for the target of the Connect Proxy Api Request
 */
export type ProxyTargetApiRequest = {
  /**
   * URL for the target of the request.  Search parameters must be included here.
   */
  url: string;
  /**
   * fetch-like options for the target of the Connect Proxy Request
   */
  options: ProxyTargetApiOpts;
};

/**
 * Creates a new instance of BackendClient with the provided options.
 *
 * @example
 *
 * ```typescript
      const serverClient = createBackendClient({
        environment: "development",
        projectId: "<project id>",
        credentials: {
          clientId: "<client id>",
          clientSecret: "<client secret>",
        },
      })
 * ```
 *
 * @param opts - The options for creating the server client.
 * @returns A new instance of ServerClient.
 */
export function createBackendClient(opts: BackendClientOpts) {
  return new BackendClient(opts);
}

/**
 * A client for interacting with the Pipedream Connect API on the server-side.
 */
export class BackendClient extends BaseClient {
  private oauthClient: {
    client: oauth.Client
    clientAuth: oauth.ClientAuth
    as: oauth.AuthorizationServer
  };
  private oauthAccessToken?: {
    token: string
    expiresAt: number
  };
  protected override projectId: string = "";

  /**
   * Constructs a new ServerClient instance.
   *
   * @param opts - The options for configuring the server client.
   * @param oauthClient - An optional OAuth client to use for authentication in tests
   */
  constructor(opts: BackendClientOpts) {
    super(opts);

    this.ensureValidEnvironment(opts.environment);
    this.projectId = opts.projectId;
    this.oauthClient = this.newOauthClient(opts.credentials, this.apiHost);
  }

  private ensureValidEnvironment(environment?: string) {
    if (!environment || ![
      "development",
      "production",
    ].includes(environment)) {
      throw new Error(
        "Project environment is required. Supported environments are development and production.",
      );
    }
  }

  private newOauthClient(
    {
      clientId, clientSecret,
    }: OAuthCredentials,
    tokenHost: string,
  ) {
    if (!clientId || !clientSecret) {
      throw new Error("OAuth client ID and secret are required");
    }
    const client: oauth.Client = {
      client_id: clientId,
    }
    const clientAuth = oauth.ClientSecretPost(clientSecret)
    const as: oauth.AuthorizationServer = {
      issuer: tokenHost,
      token_endpoint: `https://${tokenHost}/v1/oauth/token`,
    }
    return {
      client,
      clientAuth,
      as,
    }
  }

  protected authHeaders(): string | Promise<string> {
    return this.oauthAuthorizationHeader();
  }

  private async ensureValidOauthAccessToken(): Promise<string> {
    const {
      client,
      clientAuth,
      as,
    } = this.oauthClient

    let attempts = 0;
    const maxAttempts = 2;

    while (!this.oauthAccessToken || this.oauthAccessToken.expiresAt - Date.now() <= 0) {
      if (attempts > maxAttempts) {
        throw new Error("ran out of attempts trying to retrieve oauth access token");
      }
      if (attempts > 0) {
        // Wait for a short duration before retrying to avoid rapid retries
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const parameters = new URLSearchParams();
      try {
        const response = await oauth.clientCredentialsGrantRequest(as, client, clientAuth, parameters);
        const oauthTokenResponse = await oauth.processClientCredentialsResponse(as, client, response);
        this.oauthAccessToken = {
          token: oauthTokenResponse.access_token,
          expiresAt: Date.now() + (oauthTokenResponse.expires_in || 0) * 1000,
        };
      } catch {
        // pass
      }

      attempts++;
    }

    return this.oauthAccessToken.token;
  }

  private async oauthAuthorizationHeader(): Promise<string> {
    if (!this.oauthClient) {
      throw new Error("OAuth client not configured")
    }

    const accessToken = await this.ensureValidOauthAccessToken();

    return `Bearer ${accessToken}`;
  }

  /**
   * Creates a new Pipedream Connect token. See
   * https://pipedream.com/docs/connect/quickstart#connect-to-the-pipedream-api-from-your-server-and-create-a-token
   *
   * @param opts - The options for creating the connect token.
   * @returns A promise resolving to the connect token response.
   *
   * @example
   *
   * ```typescript
   * const tokenResponse = await client.connectTokenCreate({
   *   external_user_id: "external-user-id", });
   * console.log(tokenResponse.token);
   * ```
   */
  public createConnectToken(
    opts: ConnectTokenCreateOpts,
  ): Promise<ConnectTokenResponse> {
    const body = {
      ...opts,
      external_id: opts.external_user_id,
    };
    return this.makeConnectRequest("/tokens", {
      method: "POST",
      body,
    });
  }

  /**
   * Retrieves a specific account by ID.
   *
   * @param accountId - The ID of the account to retrieve.
   * @param params - Additional options for the request.
   * @returns A promise resolving to the account.
   *
   * @example
   * ```typescript
   * const account = await client.getAccountById("account-id");
   * console.log(account);
   * ```
   *
   * @example
   * ```typescript
   * const account = await client.getAccountById("account-id", {
   *   include_credentials: true,
   * });
   * console.log(account);
   * ```
   */
  public getAccountById(
    accountId: string,
    params: GetAccountByIdOpts = {},
  ): Promise<Account> {
    return this.makeConnectRequest(`/accounts/${accountId}`, {
      method: "GET",
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
  public deleteAccount(accountId: string): Promise<void> {
    return this.makeConnectRequest(`/accounts/${accountId}`, {
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
  public deleteAccountsByApp(appId: string): Promise<void> {
    return this.makeConnectRequest(`/accounts/app/${appId}`, {
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
  public deleteExternalUser(externalId: string): Promise<void> {
    return this.makeConnectRequest(`/users/${externalId}`, {
      method: "DELETE",
    });
  }

  /**
   * Retrieves the project's information, such as the list of apps linked to it.
   *
   * @returns A promise resolving to the project info response.
   *
   * @example
   * ```typescript
   * const projectInfo = await client.getProjectInfo();
   * console.log(projectInfo);
   * ```
   */
  public getProjectInfo(): Promise<ProjectInfoResponse> {
    return this.makeConnectRequest("/projects/info", {
      method: "GET",
    });
  }

  /**
   * Makes a proxy request to the target app API with the specified query parameters and options.
   *
   * @returns A promise resolving to the response from the downstream service
   */
  public makeProxyRequest(proxyOptions: ProxyApiOpts, targetRequest: ProxyTargetApiRequest): Promise<string> {
    const url64 = btoa(targetRequest.url).replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const headers = targetRequest.options.headers || {};

    const newHeaders = Object.keys(headers).reduce<{ [key: string]: string }>((acc, key) => {
      acc[`x-pd-proxy-${key}`] = headers[key];
      return acc;
    }, {});

    const newOpts: RequestOptions = {
      method: targetRequest.options.method,
      headers: newHeaders,
      params: proxyOptions.searchParams,
    }

    if (targetRequest.options.body) {
      newOpts.body = targetRequest.options.body
    }

    return this.makeConnectRequest(`/proxy/${url64}`, newOpts);
  }
}
