// This code is meant to be run server-side, where you can securely store your
// Pipedream project's public and secret keys and access customer credentials.
// See the browser/ directory for the browser client.

import {
  AccessToken,
  ClientCredentials,
} from "simple-oauth2";

export type PipedreamOAuthClient = {
  clientId: string;
  clientSecret: string;
};

/**
 * Options for creating a server-side client.
 * This is used to configure the BackendClient instance.
 */
export type CreateBackendClientOpts = {
  /**
   * The environment in which the server client is running (e.g., "production", "development").
   */
  environment?: string;

  /**
   * The OAuth object, containing client ID and client secret.
   */
  oauth?: PipedreamOAuthClient;

  /**
   * The base project ID tied to relevant API requests
   */
  projectId?: string;

  /**
   * The API host URL. Used by Pipedream employees. Defaults to "api.pipedream.com" if not provided.
   */
  apiHost?: string;

  /**
   * Base domain for workflows. Used for custom domains: https://pipedream.com/docs/workflows/domains
   */
  baseWorkflowDomain?: string;
};

/**
 * Different types of ways customers can authorize requests to HTTP endpoints
 */
export enum HTTPAuthType {
  None = "none",
  StaticBearer = "static_bearer_token",
  OAuth = "oauth"
}

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
   * An optional webhook uri that Pipedream can invoke on success or failure of connection requests.
   */
  webhook_uri?: string;

  /**
   * Specify the environment ('production' or 'development') to use for the account connection flow.
   * Defaults to 'production'.
   */
  environment_name?: string;
};

export type AppInfo = {
  /**
   * ID of the app. Only applies for OAuth apps.
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
  /**
   * The Connect Link URL
   */
  connect_link_url: string;
};

/**
 * Parameters for the Connect Accounts API
 */
export type AccountsGetParams = {
  /**
   * The name slug of the app.
   */
  app?: string;

  /**
   * The external user ID associated with the account.
   */
  external_user_id?: string;

  /**
   * The name of the account.
   */
  oauth_app_id?: string;
  /**
   * Whether to include credentials in the request (1 to include, 0 to exclude).
   */
  include_credentials?: number;
};

/**
 * The authentication type for the app.
 */
export enum AppAuthType {
  OAuth = "oauth",
  Keys = "keys",
  None = "none",
}

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
  auth_type: AppAuthType;

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
   * The credentials associated with the account, if include_credentials was true.
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
interface RequestOptions extends Omit<RequestInit, "headers" | "body"> {
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

  /**
   * The body of the request.
   */
  body?: Record<string, unknown> | string | FormData | URLSearchParams | null;
}

/**
 * Creates a new instance of BackendClient with the provided options.
 *
 * @example
 *
 * ```typescript
 * const client = createBackendClient({
 *   oauth: {
 *    clientId: "your-client-id",
 *    clientSecret: "your-client-secret",
 *   },
 * });
 * ```
 *
 * @param opts - The options for creating the server client.
 * @returns A new instance of BackendClient.
 */
export function createBackendClient(opts: CreateBackendClientOpts) {
  return new BackendClient(opts);
}

/**
 * A client for interacting with the Pipedream Connect API on the server-side.
 */
export class BackendClient {
  private environment: string;
  private oauthClient?: ClientCredentials;
  private oauthToken?: AccessToken;
  private projectId?: string;
  private readonly baseAPIURL: string;
  private readonly baseWorkflowDomain: string;

  /**
   * Constructs a new BackendClient instance.
   *
   * @param opts - The options for configuring the server client.
   * @param oauthClient - An optional OAuth client to use for authentication in tests
   */
  constructor(
    opts: CreateBackendClientOpts,
    oauthClient?: ClientCredentials,
  ) {
    this.environment = opts.environment ?? "production";
    this.projectId = opts.projectId;

    const {
      apiHost = "api.pipedream.com", baseWorkflowDomain = "m.pipedream.net",
    } = opts;
    this.baseAPIURL = `https://${apiHost}/v1`;
    this.baseWorkflowDomain = baseWorkflowDomain;

    if (oauthClient) {
      // Use the provided OAuth client (useful for testing)
      this.oauthClient = oauthClient;
    } else {
      // Configure the OAuth client normally
      this.configureOauthClient(opts, this.baseAPIURL);
    }
  }

  private configureOauthClient(
    { oauth }: CreateBackendClientOpts,
    tokenHost: string,
  ) {
    const clientId = oauth?.clientId;
    const clientSecret = oauth?.clientSecret;

    if (!clientId || !clientSecret) {
      throw new Error("OAuth client ID and secret are required");
    }

    const client = {
      id: clientId,
      secret: clientSecret,
    };

    this.oauthClient = new ClientCredentials({
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
   * Makes an HTTP request
   *
   * @template T - The expected response type.
   * @param path - The API endpoint path.
   * @param opts - The options for the request.
   * @returns A promise resolving to the API response.
   * @throws Will throw an error if the response status is not OK.
   */
  public async makeRequest<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const {
      params,
      headers: customHeaders,
      body,
      method = "GET",
      baseURL = this.baseAPIURL,
      ...fetchOpts
    } = opts;

    const url = new URL(`${baseURL}${path}`);

    if (params) {
      for (const [
        key,
        value,
      ] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      ...customHeaders,
      "X-PD-Environment": this.environment,
    };

    let processedBody: string | Buffer | URLSearchParams | FormData | null = null;

    if (body) {
      if (body instanceof FormData || body instanceof URLSearchParams || typeof body === "string") {
        // For FormData, URLSearchParams, or strings, pass the body as-is
        processedBody = body;
      } else {
        // For objects, assume it's JSON and serialize it
        processedBody = JSON.stringify(body);
        // Set the Content-Type header to application/json if not already set
        headers["Content-Type"] = headers["Content-Type"] || "application/json";
      }
    }

    const requestOptions: RequestInit = {
      method,
      headers,
      ...fetchOpts,
    };

    if ([
      "POST",
      "PUT",
      "PATCH",
    ].includes(method.toUpperCase()) && processedBody) {
      requestOptions.body = processedBody;
    }

    const response: Response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    // Attempt to parse JSON, fall back to raw text if it fails
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json() as T;
    }

    return await response.text() as unknown as T;
  }

  /**
   * Makes a request to the Pipedream API with appropriate authorization.
   *
   * @template T - The expected response type.
   * @param path - The API endpoint path.
   * @param opts - The options for the request.
   * @returns A promise resolving to the API response.
   * @throws Will throw an error if the response status is not OK.
   */
  public async makeAuthorizedRequest<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...opts.headers,
      "Authorization": await this.oauthAuthorizationHeader(),
    };

    return this.makeRequest<T>(path, {
      headers,
      ...opts,
    });
  }

  /**
   * Makes a request to the Connect API using Connect authorization.
   *
   * @template T - The expected response type.
   * @param path - The API endpoint path.
   * @param opts - The options for the request.
   * @returns A promise resolving to the API response.
   */
  private async makeConnectRequest<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const fullPath = `/connect/${this.projectId}${path}`;
    return this.makeAuthorizedRequest<T>(fullPath, opts);
  }

  /**
   * Creates a new Pipedream Connect token.
   * See https://pipedream.com/docs/connect/quickstart#connect-to-the-pipedream-api-from-your-server-and-create-a-token
   *
   * @param opts - The options for creating the connect token.
   * @returns A promise resolving to the connect token response.
   *
   * @example
   *
   * ```typescript
   * const tokenResponse = await client.connectTokenCreate({
   *   external_user_id: "external-user-id",
   * });
   * console.log(tokenResponse.token);
   * ```
   */
  public async connectTokenCreate(opts: ConnectTokenCreateOpts): Promise<ConnectTokenResponse> {
    const body = {
      ...opts,
      external_id: opts.external_user_id,
    };
    return this.makeConnectRequest<ConnectTokenResponse>("/tokens", {
      method: "POST",
      body,
    });
  }

  /**
   * Retrieves a list of accounts.
   *
   * @param params - The query parameters for retrieving accounts.
   * @returns A promise resolving to a list of accounts.
   *
   * @example
   *
   * ```typescript
   * const accounts = await client.accountsGet({ include_credentials: 1 });
   * console.log(accounts);
   * ```
   */
  public async accountsGet(params: AccountsGetParams = {}): Promise<Account[]> {
    return this.makeConnectRequest<Account[]>("/accounts", {
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
   *
   * ```typescript
   * const account = await client.accountsGetById("account-id");
   * console.log(account);
   * ```
   */
  public async accountsGetById(accountId: string, params: AccountsGetParams = {}): Promise<Account> {
    return this.makeConnectRequest<Account>(`/accounts/${accountId}`, {
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
   *
   * ```typescript
   * await client.accountDelete("account-id");
   * console.log("Account deleted");
   * ```
   */
  public async accountDelete(accountId: string): Promise<void> {
    await this.makeConnectRequest(`/accounts/${accountId}`, {
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
   *
   * ```typescript
   * await client.accountsDeleteByApp("app-id");
   * console.log("All accounts deleted");
   * ```
   */
  public async accountsDeleteByApp(appId: string): Promise<void> {
    await this.makeConnectRequest(`/accounts/app/${appId}`, {
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
   *
   * ```typescript
   * await client.accountsDeleteByExternalUser("external-id");
   * console.log("All accounts deleted");
   * ```
   */
  public async accountsDeleteByExternalUser(externalId: string): Promise<void> {
    await this.makeConnectRequest(`/users/${externalId}`, {
      method: "DELETE",
    });
  }

  /**
   * Retrieves project information.
   *
   * @returns A promise resolving to the project info response.
   *
   * @example
   *
   * ```typescript
   * const projectInfo = await client.projectGetInfo();
   * console.log(projectInfo);
   * ```
   */
  public async projectGetInfo(): Promise<ProjectInfoResponse> {
    return this.makeConnectRequest<ProjectInfoResponse>("/projects/info", {
      method: "GET",
    });
  }

  /**
 * Builds a full workflow URL based on the input.
 *
 * @param input - Either a full URL (with or without protocol) or just an endpoint ID.
 *
 * @returns The fully constructed URL.
 *
 * @throws If the input is a malformed URL, throws an error with a clear message.
 *
 * @example
 * // Full URL input
 * this.buildWorkflowUrl("https://en123.m.pipedream.net");
 * // Returns: "https://en123.m.pipedream.net"
 *
 * @example
 * // Partial URL (without protocol)
 * this.buildWorkflowUrl("en123.m.pipedream.net");
 * // Returns: "https://en123.m.pipedream.net"
 *
 * @example
 * // ID only input
 * this.buildWorkflowUrl("en123");
 * // Returns: "https://en123.yourdomain.com" (where `yourdomain.com` is set in `baseWorkflowDomain`)
 */
  private buildWorkflowUrl(input: string): string {
    let url: string;

    const isUrl = input.includes(".") || input.startsWith("http");

    if (isUrl) {
    // Try to parse the input as a URL
      try {
        const urlString = input.startsWith("http")
          ? input
          : `https://${input}`;
        const parsedUrl = new URL(urlString);
        url = parsedUrl.href;
      } catch (error) {
        throw new Error(`The provided URL is malformed: "${input}". Please provide a valid URL.`);
      }
    } else {
    // If the input is an ID, construct the full URL using the base domain
      url = `https://${input}.${this.baseWorkflowDomain}`;
    }

    return url;
  }

  /**
   * Invokes a workflow using the URL of its HTTP interface(s), by sending an
   *
   * @param urlOrEndpoint - The URL of the workflow's HTTP interface, or the ID of the endpoint
   * @param opts - The options for the request.
   * @param opts.body - The body of the request. It must be a JSON-serializable
   * value (e.g. an object, null, a string, etc.).
   * @param opts.headers - The headers to include in the request. Note that the
   * Authorization header will always be set with an OAuth access token
   * retrieved by the client.
   * @param authType - The type of authorization to use for the request.
   *
   * @returns A promise resolving to the response from the workflow.
   *
   * @example
   *
   * ```typescript
   * const response = await client.workflowInvoke(
   *   "https://your-workflow-url.m.pipedream.net",
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
   *   "oauth",
   * );
   * console.log(response);
   * ```
   */
  public async workflowInvoke(urlOrEndpoint: string, opts: RequestOptions = {}, authType: HTTPAuthType = HTTPAuthType.None): Promise<unknown> {
    const {
      body,
      headers = {},
    } = opts;

    const url = this.buildWorkflowUrl(urlOrEndpoint);

    let authHeader: string | undefined;
    switch (authType) {
    // It's expected that users will pass their own Authorization header in the static bearer case
    case HTTPAuthType.StaticBearer:
      authHeader = headers["Authorization"];
      break;
    case HTTPAuthType.OAuth:
      authHeader = await this.oauthAuthorizationHeader();
      break;
    default:
      break;
    }

    return this.makeRequest("", {
      ...opts,
      baseURL: url,
      method: opts.method || "POST", // Default to POST if not specified
      headers: authHeader
        ? {
          ...headers,
          "Authorization": authHeader,
        }
        : headers,
      body,
    });
  }

  /**
   * Invokes a workflow for a Pipedream Connect user in a project
   *
   * @param url - The URL of the workflow's HTTP interface.
   * @param externalUserId — Your end user ID, for whom you're invoking the workflow.
   * @param opts - The options for the request.
   * @param opts.body - The body of the request. It must be a JSON-serializable
   * value (e.g. an object, null, a string, etc.).
   * @param opts.headers - The headers to include in the request. Note that the
   * Authorization header will always be set with an OAuth access token
   * retrieved by the client.
   *
   * @returns A promise resolving to the response from the workflow.
   *
   * @example
   *
   * ```typescript
   * const response = await client.invokeWorkflowForExternalUser(
   *   "https://your-workflow-url.m.pipedream.net",
   *   "your-external-user-id",
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
   * console.log(response);
   * ```
   */
  public async workflowInvokeForExternalUser(url: string, externalUserId: string, opts: RequestOptions = {}): Promise<unknown> {
    const { headers = {} } = opts;

    if (!externalUserId) {
      throw new Error("External user ID is required");
    }

    if (!this.oauthClient) {
      throw new Error("OAuth is required for invoking workflows for external users. Please pass credentials for a valid OAuth client");
    }

    return this.workflowInvoke(url, {
      ...opts,
      headers: {
        ...headers,
        "X-PD-External-User-ID": externalUserId,
      },
    }, HTTPAuthType.OAuth); // OAuth auth is required for invoking workflows for external users
  }
}
