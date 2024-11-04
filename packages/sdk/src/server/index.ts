// This code is meant to be run server-side, where you can securely store your
// Pipedream project's public and secret keys and access customer credentials.
// See the browser/ directory for the browser client.

import {
  AccessToken,
  ClientCredentials,
} from "simple-oauth2";

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
 * This is used to configure the BackendClient instance.
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
 * Different ways in which customers can authorize requests to HTTP endpoints
 */
export const enum HTTPAuthType {
  None = "none",
  StaticBearer = "static_bearer_token",
  OAuth = "oauth"
}

/**
 * Options for creating a Connect token.
 */
export type ConnectTokenOpts = {
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
   */
  project_environment?: string;
};

export type AppInfo = {
  /**
   * ID of the app. Only applies for OAuth apps.
   */
  id?: string;

  /**
   * The name slug of the target app (see
   * https://pipedream.com/docs/connect/quickstart#find-your-apps-name-slug)
   */
  name_slug: string;
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
 * The types of authentication that Pipedream apps support.
 */
export const enum AppAuthType {
  OAuth = "oauth",
  Keys = "keys",
  None = "none",
}

/**
 * Response object for a Pipedream app's metadata
 */
export type AppResponse = AppInfo & {
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
 * Parameters for the retrieval of accounts from the Connect API
 */
export type GetAccountOpts = {
  /**
   * The ID or name slug of the app, in case you want to only retrieve the
   * accounts for a specific app.
   */
  app?: string;

  /**
   * The ID of the app (if it's an OAuth app), in case you want to only retrieve
   * the accounts for a specific app.
   */
  oauth_app_id?: string;

  /**
   * The external user ID associated with the account, in case you want to only
   * retrieve the accounts of a specific user.
   */
  external_user_id?: string;

  /**
   * Whether to retrieve the account's credentials or not.
   */
  include_credentials?: boolean;
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
   * Indicates if the account is healthy. Pipedream will periodically retry
   * token refresh and test requests for unhealthy accounts.
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
   * The date and time the account was last updated, an ISO 8601 formatted
   * string.
   */
  updated_at: string;

  /**
   * The credentials associated with the account, if the `include_credentials`
   * parameter was set to true in the request.
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
 *   credentials: {
 *    clientId: "your-client-id",
 *    clientSecret: "your-client-secret",
 *   },
 * });
 * ```
 *
 * @param opts - The options for creating the server client.
 * @returns A new instance of BackendClient.
 */
export function createBackendClient(opts: BackendClientOpts) {
  return new BackendClient(opts);
}

/**
 * A client for interacting with the Pipedream Connect API on the server-side.
 */
export class BackendClient {
  private environment: string;
  private oauthClient: ClientCredentials;
  private oauthToken?: AccessToken;
  private projectId: string;
  private readonly baseApiUrl: string;
  private readonly workflowDomain: string;

  /**
   * Constructs a new BackendClient instance.
   *
   * @param opts - The options for configuring the server client.
   */
  constructor(opts: BackendClientOpts) {
    this.environment = opts.environment ?? "production";

    this.projectId = opts.projectId;
    if (!this.projectId) {
      throw new Error("Project ID is required");
    }

    const {
      apiHost = "api.pipedream.com",
      workflowDomain = "m.pipedream.net",
    } = opts;
    this.baseApiUrl = `https://${apiHost}/v1`;
    this.workflowDomain = workflowDomain;

    this.oauthClient = this.newOauthClient(opts.credentials, this.baseApiUrl);
  }

  private newOauthClient(
    {
      clientId,
      clientSecret,
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
      baseURL = this.baseApiUrl,
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

    return this.makeRequest(path, {
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
  private makeConnectRequest<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    const fullPath = `/connect/${this.projectId}${path}`;
    return this.makeAuthorizedRequest(fullPath, opts);
  }

  /**
   * Creates a new Pipedream Connect token. See
   * https://pipedream.com/docs/connect/quickstart#connect-to-the-pipedream-api-from-your-server-and-create-a-token
   *
   * @param opts - The options for creating the connect token.
   * @returns A promise resolving to the connect token response.
   *
   * @example
   * ```typescript
   * const tokenResponse = await client.createConnectToken({
   *   external_user_id: "external-user-id",
   * });
   * console.log(tokenResponse.token);
   * ```
   */
  public createConnectToken(opts: ConnectTokenOpts): Promise<ConnectTokenResponse> {
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
   * Retrieves the list of accounts associated with the project.
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
  public getAccounts(params: GetAccountOpts = {}): Promise<Account[]> {
    return this.makeConnectRequest("/accounts", {
      method: "GET",
      params,
    });
  }

  /**
   * Retrieves a specific account by ID.
   *
   * @param accountId - The ID of the account to retrieve.
   * @returns A promise resolving to the account.
   *
   * @example
   * ```typescript
   * const account = await client.getAccountById("account-id");
   * console.log(account);
   * ```
   */
  public getAccountById(accountId: string): Promise<Account> {
    return this.makeConnectRequest(`/accounts/${accountId}`, {
      method: "GET",
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
   * Builds a full workflow URL based on the input.
   *
   * @param input - Either a full URL (with or without protocol) or just an
   * endpoint ID.
   * @returns The fully constructed URL.
   * @throws If the input is a malformed URL, throws an error with a clear
   * message.
   *
   * @example
   * ```typescript
   * // Full URL input
   * this.buildWorkflowUrl("https://en123.m.pipedream.net");
   * // Returns: "https://en123.m.pipedream.net"
   * ```
   *
   * @example
   * ```typescript
   * // Partial URL (without protocol)
   * this.buildWorkflowUrl("en123.m.pipedream.net");
   * // Returns: "https://en123.m.pipedream.net"
   * ```
   *
   * @example
   * ```typescript
   * // ID only input
   * this.buildWorkflowUrl("en123");
   * // Returns: "https://en123.yourdomain.com" (where `yourdomain.com` is set in `workflowDomain`)
   * ```
   */
  private buildWorkflowUrl(input: string): string {
    const sanitizedInput = input
      .trim()
      .replace(/[^\w-./:]/g, "")
      .toLowerCase();
    if (!sanitizedInput) {
      throw new Error("URL or endpoint ID is required");
    }

    let url: string;
    const isUrl = sanitizedInput.includes(".") || sanitizedInput.startsWith("http");

    if (isUrl) {
      // Try to parse the input as a URL
      let parsedUrl: URL;
      try {
        const urlString = sanitizedInput.startsWith("http")
          ? sanitizedInput
          : `https://${sanitizedInput}`;
        parsedUrl = new URL(urlString);
      } catch (error) {
        throw new Error(`
          The provided URL is malformed: "${sanitizedInput}".
          Please provide a valid URL.
        `);
      }

      // Validate the hostname to prevent potential DNS rebinding attacks
      if (!parsedUrl.hostname.endsWith(this.workflowDomain)) {
        throw new Error(`Invalid workflow domain. URL must end with ${this.workflowDomain}`);
      }

      url = parsedUrl.href;
    } else {
    // If the input is an ID, construct the full URL using the base domain
      if (!/^e(n|o)[a-z0-9-]+$/i.test(sanitizedInput)) {
        throw new Error(`
          Invalid endpoint ID format.
          Must contain only letters, numbers, and hyphens, and start with either "en" or "eo".
        `);
      }

      url = `https://${sanitizedInput}.${this.workflowDomain}`;
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
   * @returns A promise resolving to the response from the workflow.
   *
   * @example
   * ```typescript
   * const response: JSON = await client.invokeWorkflow(
   *   "https://en-your-endpoint.m.pipedream.net",
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
  public async invokeWorkflow(
    urlOrEndpoint: string,
    opts: RequestOptions = {},
    authType: HTTPAuthType = HTTPAuthType.None,
  ): Promise<unknown> {
    const {
      body,
      headers = {},
    } = opts;

    const url = this.buildWorkflowUrl(urlOrEndpoint);

    let authHeader: string | undefined;
    switch (authType) {
    case HTTPAuthType.StaticBearer:
      // It's expected that users will pass their own Authorization header in
      // the static bearer case
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
   * @param externalUserId — Your end user ID, for whom you're invoking the
   * workflow.
   * @param opts - The options for the request.
   * @param opts.body - The body of the request. It must be a JSON-serializable
   * value (e.g. an object, null, a string, etc.).
   * @param opts.headers - The headers to include in the request. Note that the
   * Authorization header will always be set with an OAuth access token
   * retrieved by the client.
   * @returns A promise resolving to the response from the workflow.
   *
   * @example
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
  public async invokeWorkflowForExternalUser(
    url: string,
    externalUserId: string,
    opts: RequestOptions = {},
  ): Promise<unknown> {
    if (!externalUserId?.trim()) {
      throw new Error("External user ID is required");
    }

    if (!url.trim()) {
      throw new Error("Workflow URL is required");
    }

    if (!this.oauthClient) {
      throw new Error("OAuth is required for invoking workflows for external users. Please pass credentials for a valid OAuth client");
    }

    const { headers = {} } = opts;
    return this.invokeWorkflow(url, {
      ...opts,
      headers: {
        ...headers,
        "X-PD-External-User-ID": externalUserId,
      },
    }, HTTPAuthType.OAuth); // OAuth auth is required for invoking workflows for external users
  }
}
