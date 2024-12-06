// This code is meant to be shared between the browser and server.
import type {
  AsyncResponse,
  AsyncErrorResponse,
  AsyncResponseManager,
} from "./async.js";
import type {
  ConfigurableProps,
  ConfiguredProps,
  V1Component,
  V1DeployedComponent,
} from "./component.js";
export * from "./component.js";
import { version as sdkVersion } from "../version.js";

type RequestInit = globalThis.RequestInit;

/**
 * Options for creating a server-side client.
 * This is used to configure the BackendClient instance.
 */
export type ClientOpts = {
  /**
   * The environment in which the server client is running (e.g., "production",
   * "development").
   */
  environment?: string;

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
 * The types of authentication that Pipedream apps support.
 */
export enum AppAuthType {
  OAuth = "oauth",
  Keys = "keys",
  None = "none",
}

/**
 * Response object for a Pipedream app's metadata
 */
export type App = AppInfo & {
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
 * @deprecated Use `App` instead.
 */
export type AppResponse = App;

// TODO: Add docstring
export type ConfigureComponentResponse = {
  options: { label: string; value: string; }[];
  stringOptions: string[];
  errors: string[];
};

/**
 * @deprecated Use `ConfigureComponentResponse` instead.
 */
export type ComponentConfigureResponse = ConfigureComponentResponse;

/**
 * Parameters for the retrieval of apps from the Connect API
 */
export type GetAppsOpts = {
  /**
   * A search query to filter the apps.
   */
  q?: string;
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
   * Whether to retrieve the account's credentials or not.
   */
  include_credentials?: boolean;

  /**
   * The external user ID associated with the account.
   */
  external_user_id?: string;
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

export type ReloadComponentPropsOpts = {
  /**
   * Your end user ID, for whom you're configuring the component.
   */
  externalUserId: string;

  /**
   * @deprecated Use `externalUserId` instead.
   */
  userId: string;

  /**
   * The ID of the component you're configuring. This is the key that uniquely
   * identifies the component.
   */
  componentId: string | ComponentId;

  /**
   * The props that have already been configured for the component. This is a
   * JSON-serializable object with the prop names as keys and the configured
   * values as values.
   */
  configuredProps: ConfiguredProps<ConfigurableProps>;

  dynamicPropsId?: string;
};

/**
 * @deprecated Use `ReloadComponentPropsOpts` instead.
 */
export type ComponentReloadPropsOpts = ReloadComponentPropsOpts;

export type ConfigureComponentOpts = {
  /**
   * Your end user ID, for whom you're configuring the component.
   */
  externalUserId: string;

  /**
   * @deprecated Use `externalUserId` instead.
   */
  userId: string;

  /**
   * The ID of the component you're configuring. This is the key that uniquely
   * identifies the component.
   */
  componentId: string | ComponentId;

  /**
   * The name of the prop you're configuring.
   */
  propName: string;

  /**
   * The props that have already been configured for the component. This is a
   * JSON-serializable object with the prop names as keys and the configured
   * values as values.
   */
  configuredProps: ConfiguredProps<ConfigurableProps>;

  dynamicPropsId?: string;
  query?: string;
};

/**
 * @deprecated Use `ConfigureComponentOpts` instead.
 */
export type ComponentConfigureOpts = ConfigureComponentOpts;

export type GetComponentsOpts = {
  q?: string;
  app?: string;
  componentType?: "trigger" | "action";
};

/**
 * @deprecated Use `GetComponentsOpts` instead.
 */
export type GetComponentOpts = GetComponentsOpts;

export type ComponentId = {
  /**
   * The key that uniquely identifies the component.
   *
   * @example "gitlab-list-commits"
   * @example "slack-send-message"
   */
  key: string;
}

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

export type GetAccountsResponse = { data: Account[]; };

/**
 * @deprecated Use `GetAccountsResponse` instead.
 */
export type AccountsRequestResponse = GetAccountsResponse;

export type GetAppsResponse = { data: App[]; };

/**
 * @deprecated Use `GetAppsResponse` instead.
 */
export type AppsRequestResponse = GetAppsResponse;

export type GetAppResponse = { data: App; };

/**
 * @deprecated Use `GetAppResponse` instead.
 */
export type AppRequestResponse = GetAppResponse;

export type GetComponentsResponse = {
  data: Omit<V1Component, "configurable_props">[];
};

/**
 * @deprecated Use `GetComponentsResponse` instead.
 */
export type ComponentsRequestResponse = GetComponentsResponse;

export type GetComponentResponse = { data: V1Component; };

/**
 * @deprecated Use `GetComponentResponse` instead.
 */
export type ComponentRequestResponse = GetComponentResponse;

export type RunActionOpts = {
  /**
   * Your end user ID, for whom you're running the action.
   */
  externalUserId: string;

  /**
   * @deprecated Use `externalUserId` instead.
   */
  userId: string;

  /**
   * The ID of the action you're running. This is the key that uniquely
   * identifies the action.
   */
  actionId: string | ComponentId;

  /**
   * The props that have already been configured for the action. This is a
   * JSON-serializable object with the prop names as keys and the configured
   * values as values.
   */
  configuredProps: ConfiguredProps<ConfigurableProps>;

  dynamicPropsId?: string;
};

// TODO: Add docstring
export type RunActionResponse = {
  exports: unknown;
  os: unknown[];
  ret: unknown;
};

export type DeployTriggerOpts = {
  /**
   * Your end user ID, for whom you're deploying the trigger.
   */
  externalUserId: string;

  /**
   * @deprecated Use `externalUserId` instead.
   */
  userId: string;

  /**
   * The ID of the trigger you're deploying. This is the key that uniquely
   * identifies the trigger.
   */
  triggerId: string | ComponentId;

  /**
   * The props that have already been configured for the trigger. This is a
   * JSON-serializable object with the prop names as keys and the configured
   * values as values.
   */
  configuredProps: ConfiguredProps<ConfigurableProps>;

  dynamicPropsId?: string;

  /**
   * The webhook URL that the trigger will use to send the events it generates.
   */
  webhookUrl?: string;
};

/**
 * Different ways in which customers can authorize requests to HTTP endpoints
 */
export enum HTTPAuthType {
  None = "none",
  StaticBearer = "static_bearer_token",
  OAuth = "oauth",
}

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
export interface RequestOptions extends Omit<RequestInit, "headers" | "body"> {
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

export interface AsyncRequestOptions extends RequestOptions {
  body: { async_handle: string; } & Required<RequestOptions["body"]>;
}

/**
 * A client for interacting with the Pipedream Connect API on the server-side.
 */
export abstract class BaseClient {
  version = sdkVersion;
  protected apiHost: string;
  protected abstract asyncResponseManager: AsyncResponseManager;
  protected readonly baseApiUrl: string;
  protected environment: string;
  protected projectId?: string;
  protected readonly workflowDomain: string;

  /**
   * Constructs a new BackendClient instance.
   *
   * @param opts - The options for configuring the server client.
   */
  constructor(opts: ClientOpts) {
    this.environment = opts.environment ?? "production";

    const {
      apiHost = "api.pipedream.com",
      workflowDomain = "m.pipedream.net",
    } = opts;
    this.apiHost = apiHost;
    this.baseApiUrl = `https://${apiHost}/v1`;
    this.workflowDomain = workflowDomain;
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
      "X-PD-SDK-Version": sdkVersion,
      "X-PD-Environment": this.environment,
    };

    let processedBody: string | URLSearchParams | FormData | null = null;

    if (body) {
      if (
        body instanceof FormData ||
        body instanceof URLSearchParams ||
        typeof body === "string"
      ) {
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

    if (
      [
        "POST",
        "PUT",
        "PATCH",
      ].includes(method.toUpperCase()) &&
      processedBody
    ) {
      requestOptions.body = processedBody;
    }

    const response: Response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorBody}`,
      );
    }

    // Attempt to parse JSON, fall back to raw text if it fails
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as unknown as T;
  }

  protected abstract authHeaders(): string | Promise<string>;

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
      "Authorization": await this.authHeaders(),
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
  protected makeConnectRequest<T>(
    path: string,
    opts: RequestOptions = {},
  ): Promise<T> {
    let fullPath = "/connect";
    if (this.projectId) {
      fullPath += `/${this.projectId}`;
    }
    fullPath += path;
    return this.makeAuthorizedRequest(fullPath, opts);
  }

  /**
   * Makes a request to the Connect API using Connect authorization.
   * This version makes an asynchronous request, fulfilled via Websocket.
   *
   * @template T - The expected response type.
   * @param path - The API endpoint path.
   * @param opts - The options for the request.
   * @returns A promise resolving to the API response.
   */
  protected async makeConnectRequestAsync<T extends object>(
    path: string,
    opts: AsyncRequestOptions,
  ): Promise<T> {
    await this.asyncResponseManager.ensureConnected();
    const data = await this.makeConnectRequest<
      AsyncResponse | AsyncErrorResponse | T
    >(path, opts);
    if ("errors" in data && data.errors.length) {
      throw new Error(data.errors[0]);
    }
    if ("async_handle" in data && data.async_handle) {
      const result = await this.asyncResponseManager.waitFor<T>(
        data.async_handle,
      );
      return result;
    }
    return data as T;
  }

  /**
   * Retrieves the list of accounts associated with the project.
   *
   * @param params - The query parameters for retrieving accounts.
   * @returns A promise resolving to a list of accounts.
   *
   * @example
   * ```typescript
   * const accounts = await client.getAccounts({ include_credentials: true });
   * console.log(accounts);
   * ```
   */
  public getAccounts(params: GetAccountOpts = {}) {
    return this.makeConnectRequest<GetAccountsResponse>("/accounts", {
      method: "GET",
      params,
    });
  }

  /**
   * Retrieves the list of apps available in Pipedream.
   *
   * @param params - The query parameters for retrieving apps.
   * @param params.q - A search query to filter the apps.
   *
   * @returns A promise resolving to a list of apps.
   *
   * @example
   * ```typescript
   * const apps = await client.getApps({ q: "slack" });
   * console.log(apps);
   * ```
   */
  public async getApps(opts?: GetAppsOpts) {
    const params: Record<string, string> = {};
    if (opts?.q) {
      params.q = opts.q;
    }
    const resp = await this.makeAuthorizedRequest<GetAppsResponse>(
      "/apps",
      {
        method: "GET",
        params,
      },
    );
    return resp;
  }

  /**
   * @deprecated Use `getApps` instead.
   */
  public apps(opts?: GetAppsOpts) {
    return this.getApps(opts);
  }

  /**
   * Retrieves the metadata for a specific app.
   *
   * @param idOrNameSlug - The ID or name slug of the app.
   * @returns A promise resolving to the app metadata.
   *
   * @example
   * ```typescript
   * const app = await client.getApp("slack");
   * console.log(app);
   * ```
   */
  public async getApp(idOrNameSlug: string) {
    const url = `/apps/${idOrNameSlug}`;
    const resp = await this.makeAuthorizedRequest<GetAppResponse>(url, {
      method: "GET",
    });
    return resp;
  }

  /**
   * @deprecated Use `getApp` instead.
   */
  public app(idOrNameSlug: string) {
    return this.getApp(idOrNameSlug);
  }

  /**
   * Retrieves the list of components available in Pipedream.
   *
   * @param opts - The options for retrieving components.
   * @param opts.q - A search query to filter the components.
   * @param opts.app - The ID or name slug of the app to filter the components.
   * @param opts.componentType - The type of component to filter (either "trigger" or "action").
   * @returns A promise resolving to a list of components.
   *
   * @example
   * ```typescript
   * const components = await client.getComponents({ q: "slack" });
   * console.log(components);
   * ```
   */
  public async getComponents(opts?: GetComponentsOpts) {
    const params: Record<string, string> = {
      limit: "20",
    };
    if (opts?.app) {
      params.app = opts.app;
    }
    if (opts?.q) {
      params.q = opts.q;
    }
    // XXX can just use /components and ?type instead when supported
    let path = "/components";
    if (opts?.componentType === "trigger") {
      path = "/triggers";
    } else if (opts?.componentType === "action") {
      path = "/actions";
    }
    // XXX Is V1Component the correct type for triggers and actions?
    const resp = await this.makeConnectRequest<ComponentsRequestResponse>(path, {
      method: "GET",
      params,
    });
    return resp;
  }

  /**
   * @deprecated Use `getComponents` instead.
   */
  public components(opts?: GetComponentOpts) {
    return this.getComponents(opts);
  }

  /**
   * Retrieves the metadata for a specific component.
   *
   * @param id - The identifier of the component.
   * @param id.key - The key that uniquely identifies the component.
   * @returns A promise resolving to the component metadata.
   *
   * @example
   * ```typescript
   * const component = await client.getComponent("slack-send-message");
   * console.log(component);
   * ```
   */
  public async getComponent(id: ComponentId) {
    const { key } = id;
    const path = `/components/${key}`;
    const resp = await this.makeConnectRequest<GetComponentResponse>(path, {
      method: "GET",
    });
    return resp;
  }

  /**
   * @deprecated Use `getComponent` instead.
   */
  public component({ key }: { key: string; }) {
    return this.getComponent({
      key,
    });
  }

  /**
   * Configure the next component's prop, based on the current component's
   * configuration.
   * @param opts - The options for configuring the component.
   * @returns
   */
  public configureComponent(opts: ConfigureComponentOpts) {
    const {
      userId,
      externalUserId = userId,
      componentId,
    } = opts;

    const id = typeof componentId === "object"
      ? componentId.key
      : componentId;

    const body = {
      async_handle: this.asyncResponseManager.createAsyncHandle(),
      external_user_id: externalUserId,
      id,
      prop_name: opts.propName,
      configured_props: opts.configuredProps,
      dynamic_props_id: opts.dynamicPropsId,
    };
    return this.makeConnectRequestAsync<ConfigureComponentResponse>("/components/configure", {
      method: "POST",
      body,
    });
  }

  /**
   * @deprecated Use `configureComponent` instead.
   */
  public componentConfigure(opts: ComponentConfigureOpts) {
    return this.configureComponent(opts);
  }

  // TODO: Add docstring
  public reloadComponentProps(opts: ReloadComponentPropsOpts) {
    const {
      userId,
      externalUserId = userId,
      componentId,
    } = opts;

    const id = typeof componentId === "object"
      ? componentId.key
      : componentId;

    // RpcActionReloadPropsInput
    const body = {
      async_handle: this.asyncResponseManager.createAsyncHandle(),
      external_user_id: externalUserId,
      id,
      configured_props: opts.configuredProps,
      dynamic_props_id: opts.dynamicPropsId,
    };

    return this.makeConnectRequestAsync<ConfiguredProps<ConfigurableProps>>(
      "/components/props", {
      // TODO trigger
        method: "POST",
        body,
      },
    );
  }

  /**
   * @deprecated Use `reloadComponentProps` instead.
   */
  public componentReloadProps(opts: ComponentReloadPropsOpts) {
    return this.reloadComponentProps(opts);
  }

  /**
   * Invoke an action component for a Pipedream Connect user in a project
   *
   * @param opts
   * @returns A promise resolving to the response from the action's execution.
   *
   * @example
   * ```typescript
   * const response = await client.runAction({
   *   externalUserId: "jverce",
   *   actionId: {
   *     key: "gitlab-list-commits",
   *   },
   *   configuredProps: {
   *     gitlab: {
   *       authProvisionId: "apn_z8hD1b4"
   *     },
   *     projectId: 21208123,
   *     refName: "10-0-stable-ee",
   *   },
   * });
   * ```
   */
  public runAction(opts: RunActionOpts) {
    const {
      userId,
      externalUserId = userId,
      actionId,
    } = opts;

    const id = typeof actionId === "object"
      ? actionId.key
      : actionId;

    const body = {
      async_handle: this.asyncResponseManager.createAsyncHandle(),
      external_user_id: externalUserId,
      id,
      configured_props: opts.configuredProps,
      dynamic_props_id: opts.dynamicPropsId,
    };
    return this.makeConnectRequestAsync<RunActionResponse>("/actions/run", {
      method: "POST",
      body,
    });
  }

  /**
   * @deprecated Use `runAction` instead.
   */
  public actionRun(opts: RunActionOpts) {
    return this.runAction(opts);
  }

  /**
   * Deploy a trigger component for a Pipedream Connect user in a project
   *
   * @param opts
   * @returns A promise resolving to the response from the trigger's deployment.
   */
  public deployTrigger(opts: DeployTriggerOpts) {
    const {
      userId,
      externalUserId = userId,
      triggerId,
    } = opts;

    const id = typeof triggerId === "object"
      ? triggerId.key
      : triggerId;

    const body = {
      async_handle: this.asyncResponseManager.createAsyncHandle(),
      external_user_id: externalUserId,
      id,
      configured_props: opts.configuredProps,
      dynamic_props_id: opts.dynamicPropsId,
      webhook_url: opts.webhookUrl,
    };
    return this.makeConnectRequestAsync<V1DeployedComponent>("/triggers/deploy", {
      method: "POST",
      body,
    });
  }

  /**
   * @deprecated Use `triggerDeploy` instead.
   */
  public triggerDeploy(opts: DeployTriggerOpts) {
    return this.deployTrigger(opts);
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
    const isUrl =
      sanitizedInput.includes(".") || sanitizedInput.startsWith("http");

    if (isUrl) {
      // Try to parse the input as a URL
      let parsedUrl: URL;
      try {
        const urlString = sanitizedInput.startsWith("http")
          ? sanitizedInput
          : `https://${sanitizedInput}`;
        parsedUrl = new URL(urlString);
      } catch {
        throw new Error(`
          The provided URL is malformed: "${sanitizedInput}".
          Please provide a valid URL.
        `);
      }

      // Validate the hostname to prevent potential DNS rebinding attacks
      if (!parsedUrl.hostname.endsWith(this.workflowDomain)) {
        throw new Error(
          `Invalid workflow domain. URL must end with ${this.workflowDomain}`,
        );
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
      body, headers = {},
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
      authHeader = await this.authHeaders(); // TODO How to handle this client side? We should pass the auth even if it's not OAuth
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
          Authorization: authHeader,
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

    if (!(await this.authHeaders())) {
      throw new Error(
        // TODO Test that this works with token auth
        "OAuth or token is required for invoking workflows for external users. Please pass credentials for a valid OAuth client",
      );
    }

    const { headers = {} } = opts;
    return this.invokeWorkflow(
      url,
      {
        ...opts,
        headers: {
          ...headers,
          "X-PD-External-User-ID": externalUserId,
        },
      },
      HTTPAuthType.OAuth,
    ); // OAuth auth is required for invoking workflows for external users
  }
}
