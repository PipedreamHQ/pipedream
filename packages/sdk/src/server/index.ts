// This code is meant to be run server-side, where you can securely store your
// Pipedream project's public and secret keys and access customer credentials.
// See the browser/ directory for the browser client.

import {
  AccessToken, ClientCredentials,
} from "simple-oauth2";
import {
  AppInfo, BaseClient, ConnectTokenResponse,
} from "../shared";

/**
 * OAuth credentials for your Pipedream account, containing client ID and
 * secret.
 */
export type OAuthCredentials = {
  clientId: string;
  clientSecret: string;
};

/**
 * Options for creating a server-side client.
 * This is used to configure the ServerClient instance.
 */
export type BackendClientOpts = {
  /**
   * The environment in which the server client is running (e.g., "production",
   * "development").
   */
  environment?: string;

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
   * An external user ID associated with the token.
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
   * Specify the environment ("production" or "development") to use for the
   * account connection flow. Defaults to "production".
  *
   * @deprecated in favor of the `environment` field in `BackendClientOpts`.
   * This field is completely ignored.
   */
  environment_name?: string;

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
 * Creates a new instance of BackendClient with the provided options.
 *
 * @example
 *
 * ```typescript
 * const client = createClient({
 *   publicKey: "your-public-key",
 *   secretKey: "your-secret-key",
 * });
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
  private oauthClient: ClientCredentials;
  private oauthToken?: AccessToken;
  protected projectId: string;

  /**
   * Constructs a new ServerClient instance.
   *
   * @param opts - The options for configuring the server client.
   * @param oauthClient - An optional OAuth client to use for authentication in tests
   */
  constructor(opts: BackendClientOpts) {
    super(opts);

    this.projectId = opts.projectId;

    this.oauthClient = this.newOauthClient(opts.credentials, this.baseApiUrl);
  }

  protected authHeaders(): string | Promise<string> {
    return this.oauthAuthorizationHeader();
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

    const client = {
      id: clientId,
      secret: clientSecret,
    };
    return new ClientCredentials({
      client,
      auth: {
        tokenHost,
        tokenPath: "/v1/oauth/token",
      },
    });
  }

  private async oauthAuthorizationHeader(): Promise<string> {
    if (!this.oauthClient) {
      throw new Error("OAuth client not configured");
    }

    let attempts = 0;
    const maxAttempts = 2; // Prevent potential infinite loops

    do {
      if (attempts > 0) {
        // Wait for a short duration before retrying to avoid rapid retries
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      try {
        this.oauthToken = await this.oauthClient.getToken({});
      } catch (error: any) {
        throw new Error(`Failed to obtain OAuth token: ${error.message}`);
      }

      attempts++;
    } while (this.oauthToken.expired() && attempts < maxAttempts);

    if (this.oauthToken.expired()) {
      throw new Error("Unable to obtain a valid (non-expired) OAuth token");
    }

    return `Bearer ${this.oauthToken.token.access_token}`;
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
      environment_name: this.environment, // TODO fix sdk 1.0.0 being out of sync, etc.
    };
    return this.makeConnectRequest("/tokens", {
      method: "POST",
      body,
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
}
