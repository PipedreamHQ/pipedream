// This code is meant to be shared between the browser and server.
import type {
  ConfigurableProps,
  ConfiguredProps,
  V1Component,
  V1DeployedComponent,
  V1EmittedEvent,
} from "./component.js";
export * from "./component.js";
import { version as sdkVersion } from "../version.js";

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
    }[Keys]

// Using `RequireAtLeastOne` here prevents the renaming of the attribute to
// break existing SDK users, by keeping the old attribute name, while ensuring
// that at least one of the two attributes is present.
type ExternalUserId = RequireAtLeastOne<{
  /**
   * Your end user ID, for whom you're configuring the component.
   */
  externalUserId: string;

  /**
   * @deprecated Use `externalUserId` instead.
   */
  userId: string;
}, "externalUserId" | "userId">;

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

/**
 * Basic ID information of a Pipedream app.
 */
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

/**
 * A configuration option for a component's prop.
 */
export type PropOption = {
  label: string;
  value: string;
};

/**
 * The response received after configuring a component's prop.
 */
export type ConfigureComponentResponse = {
  /**
   * The options for the prop that's being configured. This field is applicable
   * when the values don't nicely map to a descriptive string. Useful when the
   * values for each option are meaningless numeric IDs, unless mapped to a
   * human-readable string.
   *
   * @example a branch with ID `21208123` and name `my-repo/foo` in a Gitlab
   * repo
   * ```json
   * {
   *   "label": "my-repo/foo",
   *   "value": 21208123
   * }
   * ```
   */
  options: PropOption[];

  /**
   * The options for the prop that's being configured. This field is applicable
   * when the values themselves are already human-readable strings.
   */
  stringOptions: string[];

  /**
   * A list of errors that occurred during the configuration process.
   */
  errors: string[];
};

/**
 * Attributes to use for pagination in API requests.
 */
export type RelationOpts = {
  /**
   * The retrieve records starting from a certain cursor.
   */
  after?: string;

  /**
   * To retrieve records up until a certain cursor.
   */
  before?: string;

  /**
   * The maximum number of records to retrieve.
   */
  limit?: number;
};

/**
 * Pagination attributes for API responses.
 */
export type ResponsePageInfo = {
  /**
   * The total number of records available.
   */
  total_count: number;

  /**
   * The number of records returned in the current response.
   */
  count: number;

  /**
   * The cursor to retrieve the next page of records.
   */
  start_cursor: string;

  /**
   * The cursor of the last page of records.
   */
  end_cursor: string;
};

/**
 * The response attributes for paginated API responses.
 */
export type PaginationResponse = {
  /**
   * The pagination information for the response.
   */
  page_info: ResponsePageInfo;
}

/**
 * @deprecated Use `ConfigureComponentResponse` instead.
 */
export type ComponentConfigureResponse = ConfigureComponentResponse;

/**
 * Parameters for the retrieval of apps from the Connect API
 */
export type GetAppsOpts = RelationOpts & {
  /**
   * A search query to filter the apps.
   */
  q?: string;
  /**
   * Filter by whether apps have actions in the component registry.
   */
  hasActions?: boolean;
  /**
   * Filter by whether apps have components in the component registry.
   */
  hasComponents?: boolean;
  /**
   * Filter by whether apps have triggers in the component registry.
   */
  hasTriggers?: boolean;
};

/**
 * Parameters for the retrieval of accounts from the Connect API
 */
export type GetAccountOpts = RelationOpts & {
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

/**
 * The request options for reloading a component's props when dealing with
 * dynamic props.
 */
export type ReloadComponentPropsOpts = ExternalUserId & {
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

  /**
   * The ID of the last prop reload (or none when reloading the props for the
   * first time).
   */
  dynamicPropsId?: string;
};

export type ReloadComponentPropsResponse = {
  // XXX observations

  /**
   * A list of errors that occurred during the prop reloading process.
   */
  errors: string[]

  /**
   * Dynamic props object containing the dynamic props ID and the dynamic
   * configurable props for the component.
   */
  dynamicProps: {
    id: string
    configurableProps: ConfigurableProps
  }
}

/**
 * @deprecated Use `ReloadComponentPropsOpts` instead.
 */
export type ComponentReloadPropsOpts = ReloadComponentPropsOpts;

/**
 * The request options for configuring a component's prop.
 */
export type ConfigureComponentOpts = ExternalUserId & {
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

  /**
   * The ID of the last prop reconfiguration (if any).
   */
  dynamicPropsId?: string;

  /**
   * A string with the user input if the prop has the useQuery property set to
   * true. Use with APIs that return items based on a query or search parameter.
   */
  query?: string;

  /**
   * A 0 indexed page number. Use with APIs that accept a
   * numeric page number for pagination.
   */
  page?: number;

  /**
   * A string representing the context for the previous options
   * execution. Use with APIs that accept a token representing the last
   * record for pagination.
   */
  prevContext?: never;
};

/**
 * @deprecated Use `ConfigureComponentOpts` instead.
 */
export type ComponentConfigureOpts = ConfigureComponentOpts;

/**
 * The request options for retrieving a list of components.
 */
export type GetComponentsOpts = RelationOpts & {
  /**
   * A search query to filter the components.
   */
  q?: string;

  /**
   * The ID or name slug of the app to filter the components.
   */
  app?: string;

  /**
   * The type of component to filter (either "trigger" or "action").
   */
  componentType?: ComponentType;
};

/**
 * @deprecated Use `GetComponentsOpts` instead.
 */
export type GetComponentOpts = GetComponentsOpts;

/**
 * An object that identifies a single, unique component in Pipedream.
 */
export type ComponentId = {
  /**
   * The key that uniquely identifies the component.
   *
   * @example "gitlab-list-commits"
   * @example "slack-send-message"
   */
  key: string;
};

/**
 * Components can be either triggers or actions.
 */
export type ComponentType = "trigger" | "action";

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
 * The response received when retrieving a list of accounts.
 */
export type GetAccountsResponse = { data: Account[]; };

/**
 * @deprecated Use `GetAccountsResponse` instead.
 */
export type AccountsRequestResponse = GetAccountsResponse;

/**
 * The response received when retrieving a list of apps.
 */
export type GetAppsResponse = { data: App[]; };

/**
 * @deprecated Use `GetAppsResponse` instead.
 */
export type AppsRequestResponse = GetAppsResponse;

/**
 * The response received when retrieving a specific app.
 */
export type GetAppResponse = { data: App; };

/**
 * @deprecated Use `GetAppResponse` instead.
 */
export type AppRequestResponse = GetAppResponse;

/**
 * The response received when retrieving a list of components.
 */
export type GetComponentsResponse = {
  data: Omit<V1Component, "configurable_props">[];
};

/**
 * @deprecated Use `GetComponentsResponse` instead.
 */
export type ComponentsRequestResponse = GetComponentsResponse;

/**
 * The response received when retrieving a specific component.
 */
export type GetComponentResponse = { data: V1Component; };

/**
 * @deprecated Use `GetComponentResponse` instead.
 */
export type ComponentRequestResponse = GetComponentResponse;

/**
 * The request options for running an action.
 */
export type RunActionOpts = ExternalUserId & {
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

  /**
   * The ID of the last prop reconfiguration (if any).
   */
  dynamicPropsId?: string;
};

/**
 * The response received after running an action. See
 * https://pipedream.com/docs/components/api#returning-data-from-steps for more
 * details.
 */
export type RunActionResponse = {
  /**
   * The key-value pairs resulting from calls to `$.export`
   */
  exports: unknown;

  /**
   * Any logs produced during the execution of the action
   */
  os: unknown[];

  /**
   * The value returned by the action
   */
  ret: unknown;
};

/**
 * The request options for deploying a trigger.
 */
export type DeployTriggerOpts = ExternalUserId & {
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

  /**
   * The ID of the last prop reconfiguration (if any).
   */
  dynamicPropsId?: string;

  /**
   * The ID of the workflow that the trigger will use to send the events it
   * generates.
   */
  workflowId?: string;

  /**
   * The webhook URL that the trigger will use to send the events it generates.
   */
  webhookUrl?: string;
};

/**
 * The response received after deploying a trigger.
 */
export type DeployTriggerResponse = {
  /**
   * The contents of the deployed trigger.
   */
  data: V1DeployedComponent;
}

/**
 * The request options for deleting a deployed trigger owned by a particular
 * user.
 */
export type DeleteTriggerOpts = {
  /**
   * The ID of the trigger you're deleting (`dc_xxxxxxx` for example ).
   */
  id: string;

  /**
   * The end user ID, for whom you deployed the trigger.
   */
  externalUserId: string;

  /**
   * When explicitly set, the API will ignore any errors that occur during the
   * deactivation hook of the trigger, effectively forcing the deletion of the
   * trigger.
   */
  ignoreHookErrors?: boolean;
};

/**
 * The request options for retrieving a deployed trigger owned by a particular
 * user.
 */
export type GetTriggerOpts = {
  /**
   * The ID of the trigger you're retrieving.
   */
  id: string;

  /**
   * Your end user ID, for whom you deployed the trigger.
   */
  externalUserId: string;
};

/**
 * The response received after retrieving a deployed trigger.
 */
export type GetTriggerResponse = {
  /**
   * The contents of the deployed trigger.
   */
  data: V1DeployedComponent;
};

/**
 * The request options for retrieving the events emitted by a deployed trigger.
 */
export type GetTriggerEventsOpts = GetTriggerOpts & {
  /**
   * The number of events to retrieve (defaults to 20 if not provided).
   */
  limit?: number;
};

/**
 * The response from retrieving the events emitted by a deployed trigger.
 */
export type GetTriggerEventsResponse = {
  /**
   * The list of events emitted by the trigger.
   */
  data: V1EmittedEvent[];
};

/**
 * The request options for retrieving the workflows that listen to events
 * emitted by a specific trigger.
 */
export type GetTriggerWorkflowsOpts = GetTriggerOpts;

/**
 * The response from retrieving the workflows that listen to events emitted by a
 * specific trigger.
 */
export type GetTriggerWorkflowsResponse = {
  /**
   * The list of workflow IDs that listen to events emitted by the trigger.
   */
  workflow_ids: string[];
};

/**
 * The request options for updating the workflows that listen to events emitted
 * by a specific trigger.
 */
export type UpdateTriggerWorkflowsOpts = GetTriggerOpts & {
  /**
   * The workflow IDs that should to events emitted by the trigger.
   */
  workflowIds: string[];
}

/**
 * The request options for retrieving the webhooks that listen to events
 * emitted by a specific trigger.
 */
export type GetTriggerWebhooksOpts = GetTriggerOpts;

/**
 * The response from retrieving the webhooks that listen to events emitted by a
 * specific trigger.
 */
export type GetTriggerWebhooksResponse = {
  /**
   * The list of webhook URLs that listen to events emitted by the trigger.
   */
  webhook_urls: string[];
};

/**
 * The request options for updating the webhooks that listen to events emitted
 * by a specific trigger.
 */
export type UpdateTriggerWebhooksOpts = GetTriggerOpts & {
  /**
   * The webhook URLs that should to events emitted by the trigger.
   */
  webhookUrls: string[];
}

/**
 * The request options for retrieving a list of deployed triggers for a
 * particular user.
 */
export type GetTriggersOpts = RelationOpts & {
  /**
   * Your end user ID, for whom you deployed the trigger.
   */
  externalUserId: string;
};

/**
 * The response received after retrieving a list of deployed triggers.
 */
export type GetTriggersResponse = PaginationResponse & {
  /**
   * The list of deployed triggers.
   */
  data: V1DeployedComponent[];
};

/**
 * The request options for updating a trigger.
 */
export type UpdateTriggerOpts = {
  /**
   * The ID of the trigger you're updating.
   */
  id: string;

  /**
   * Your end user ID, for whom you deployed the trigger.
   */
  externalUserId: string;

  /**
   * The state to which the trigger should be updated.
   */
  active?: boolean;

  /**
   * The new name of the trigger.
   */
  name?: string;
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
  params?: Record<string, string | boolean | number | null>;

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
   * Retrieves the current environment the client is configured to use.
   * @returns {string} The current environment.
   */
  public getEnvironment(): string {
    return this.environment;
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
      ...opts,
      headers,
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
   * @param opts - The options for retrieving apps.
   * @returns A promise resolving to a list of apps.
   *
   * @example
   * ```typescript
   * const apps = await client.getApps({ q: "slack" });
   * console.log(apps);
   * ```
   */
  public getApps(opts?: GetAppsOpts) {
    const params: Record<string, string> = {};
    if (opts?.q) {
      params.q = opts.q;
    }
    if (opts?.hasActions != null) {
      params.has_actions = opts.hasActions
        ? "1"
        : "0";
    }
    if (opts?.hasComponents != null) {
      params.has_components = opts.hasComponents
        ? "1"
        : "0";
    }
    if (opts?.hasTriggers != null) {
      params.has_triggers = opts.hasTriggers
        ? "1"
        : "0";
    }

    this.addRelationOpts(params, opts);
    return this.makeAuthorizedRequest<GetAppsResponse>(
      "/apps",
      {
        method: "GET",
        params,
      },
    );
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
  public getApp(idOrNameSlug: string) {
    const url = `/apps/${idOrNameSlug}`;
    return this.makeAuthorizedRequest<GetAppResponse>(url, {
      method: "GET",
    });
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
   * @returns A promise resolving to a list of components.
   *
   * @example
   * ```typescript
   * const components = await client.getComponents({ q: "slack" });
   * console.log(components);
   * ```
   */
  public getComponents(opts?: GetComponentsOpts) {
    const params: Record<string, string> = {};
    if (opts?.app) {
      params.app = opts.app;
    }
    if (opts?.q) {
      params.q = opts.q;
    }
    this.addRelationOpts(params, opts, 20);
    // XXX can just use /components and ?type instead when supported
    let path = "/components";
    if (opts?.componentType === "trigger") {
      path = "/triggers";
    } else if (opts?.componentType === "action") {
      path = "/actions";
    }
    // XXX Is V1Component the correct type for triggers and actions?
    return this.makeConnectRequest<GetComponentsResponse>(path, {
      method: "GET",
      params,
    });
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
   * @returns A promise resolving to the component metadata.
   *
   * @example
   * ```typescript
   * const component = await client.getComponent("slack-send-message");
   * console.log(component);
   * ```
   */
  public getComponent(id: ComponentId) {
    const { key } = id;
    const path = `/components/${key}`;
    return this.makeConnectRequest<GetComponentResponse>(path, {
      method: "GET",
    });
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
   *
   * @param opts - The options for configuring the component.
   * @returns A promise resolving to the response from the configuration.
   *
   * @example
   * ```typescript
   * const { options } = await client.configureComponent({
   *  externalUserId: "jverce",
   *  componentId: {
   *    key: "slack-send-message",
   *  },
   *  propName: "channel",
   *  configuredProps: {
   *    slack: {
    *     authProvisionId: "apn_z8hD1b4",
    *   },
   *  },
   * });
   * console.log(options);
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
      external_user_id: externalUserId,
      id,
      prop_name: opts.propName,
      configured_props: opts.configuredProps,
      dynamic_props_id: opts.dynamicPropsId,
      page: opts.page,
      prev_context: opts.prevContext,
      query: opts.query,
    };
    return this.makeConnectRequest<ConfigureComponentResponse>("/components/configure", {
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

  /**
   * Reload the component prop's based on the current component's configuration.
   * This applies to dynamic props (see the docs for more info:
   * https://pipedream.com/docs/components/api#dynamic-props).
   *
   * @param opts - The options for reloading the component's props.
   * @returns A promise resolving to the response from the reload.
   *
   * @example
   * ```typescript
   * const { dynamicProps } = await client.reloadComponentProps({
   *  externalUserId: "jverce",
   *  componentId: {
   *    key: "slack-send-message",
   *  },
   *  configuredProps: {
   *    slack: {
   *      authProvisionId: "apn_z8hD1b4",
   *    },
   *  },
   * });
   *
   * const { configurableProps, id: dynamicPropsId } = dynamicProps;
   * // Use `dynamicPropsId` to configure the next prop
   * // Use `configurableProps` to display the new set of props to the user
   */
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
      external_user_id: externalUserId,
      id,
      configured_props: opts.configuredProps,
      dynamic_props_id: opts.dynamicPropsId,
    };

    return this.makeConnectRequest<ReloadComponentPropsResponse>(
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
   * @param opts - The options for running the action.
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
   * console.log(response);
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
      external_user_id: externalUserId,
      id,
      configured_props: opts.configuredProps,
      dynamic_props_id: opts.dynamicPropsId,
    };
    return this.makeConnectRequest<RunActionResponse>("/actions/run", {
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
   * @param opts - The options for deploying the trigger.
   * @returns A promise resolving to the response from the trigger's deployment.
   *
   * @example
   * ```typescript
   * const response = await client.deployTrigger({
   *   externalUserId: "jverce",
   *   triggerId: {
   *     key: "gitlab-new-issue",
   *   },
   *   configuredProps: {
   *     gitlab: {
   *       authProvisionId: "apn_z8hD1b4",
   *     },
   *     projectId: 21208123,
   *   },
   *   webhookUrl: "https://dest.mydomain.com",
   * });
   * console.log(response);
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
      external_user_id: externalUserId,
      id,
      configured_props: opts.configuredProps,
      dynamic_props_id: opts.dynamicPropsId,
      webhook_url: opts.webhookUrl,
    };
    return this.makeConnectRequest<DeployTriggerResponse>("/triggers/deploy", {
      method: "POST",
      body,
    });
  }

  /**
   * @deprecated Use `deployTrigger` instead.
   */
  public triggerDeploy(opts: DeployTriggerOpts) {
    return this.deployTrigger(opts);
  }

  /**
   * Deletes a specific trigger.
   *
   * @param opts - The options for deleting the trigger.
   * @returns No content
   */
  public deleteTrigger(opts: DeleteTriggerOpts) {
    const {
      id,
      externalUserId,
      ignoreHookErrors = null,
    } = opts;

    return this.makeConnectRequest<void>(`/deployed-triggers/${id}`, {
      method: "DELETE",
      params: {
        external_user_id: externalUserId,
        ignore_hook_errors: ignoreHookErrors,
      },
    });
  }

  /**
   * Retrieves the metadata for a specific trigger.
   *
   * @param opts - The options for retrieving the trigger.
   * @returns A promise resolving to the trigger metadata.
   */
  public getTrigger(opts: GetTriggerOpts) {
    const {
      id,
      externalUserId,
    } = opts;

    return this.makeConnectRequest<GetTriggerResponse>(`/deployed-triggers/${id}`, {
      method: "GET",
      params: {
        external_user_id: externalUserId,
      },
    });
  }

  /**
   * Retrieves the metadata for all deployed triggers
   *
   * @param opts - The options for retrieving the triggers.
   * @returns A promise resolving to a list of the trigger metadata.
   */
  public getTriggers(opts: GetTriggersOpts) {
    const { externalUserId } = opts;

    return this.makeConnectRequest<GetTriggersResponse>("/deployed-triggers", {
      method: "GET",
      params: {
        external_user_id: externalUserId,
      },
    });
  }

  /**
   * Updates a specific trigger.
   *
   * @param opts - The options for updating the trigger.
   * @returns A promise resolving to the trigger metadata.
   */
  public updateTrigger(opts: UpdateTriggerOpts) {
    const {
      id,
      externalUserId,
      active = null,
      name = null,
    } = opts;

    return this.makeConnectRequest<V1DeployedComponent>(`/deployed-triggers/${id}`, {
      method: "PUT",
      params: {
        external_user_id: externalUserId,
      },
      body: {
        active,
        name,
      },
    });
  }

  /**
   * Retrieves the last events emitted by a specific trigger.
   *
   * @param opts - The options for retrieving the trigger events.
   * @returns A promise resolving to a list of emitted events.
   */
  public getTriggerEvents(opts: GetTriggerEventsOpts) {
    const {
      id,
      externalUserId,
      limit = null,
    } = opts;

    return this.makeConnectRequest<GetTriggerEventsResponse>(
      `/deployed-triggers/${id}/events`, {
        method: "GET",
        params: {
          external_user_id: externalUserId,
          n: limit,
        },
      },
    );
  }

  /**
   * Retrieves the list of workflows to which the trigger emits events.
   *
   * @param opts - The options for retrieving the listening workflows.
   * @returns A promise resolving to a list of workflows.
   */
  public getTriggerWorkflows(opts: GetTriggerWorkflowsOpts) {
    const {
      id,
      externalUserId,
    } = opts;

    return this.makeConnectRequest<GetTriggerWorkflowsResponse>(
      `/deployed-triggers/${id}/pipelines`, {
        method: "GET",
        params: {
          external_user_id: externalUserId,
        },
      },
    );
  }

  /**
   * Updates the list of workflows to which the trigger will emit events.
   *
   * @param opts - The options for updating the listening workflows.
   * @throws If `workflowIds` is not an array.
   * @returns A promise resolving to a list of workflows.
   */
  public updateTriggerWorkflows(opts: UpdateTriggerWorkflowsOpts) {
    const {
      id,
      externalUserId,
      workflowIds,
    } = opts;

    if (!Array.isArray(workflowIds)) {
      throw new Error("workflowIds must be an array");
    }

    return this.makeConnectRequest<GetTriggerWorkflowsResponse>(
      `/deployed-triggers/${id}/pipelines`, {
        method: "PUT",
        params: {
          external_user_id: externalUserId,
        },
        body: {
          workflow_ids: workflowIds,
        },
      },
    );
  }

  /**
   * Retrieves the list of webhooks to which the trigger emits events.
   *
   * @param opts - The options for retrieving the listening webhooks.
   * @returns A promise resolving to a list of webhooks.
   */
  public getTriggerWebhooks(opts: GetTriggerWebhooksOpts) {
    const {
      id,
      externalUserId,
    } = opts;

    return this.makeConnectRequest<GetTriggerWebhooksResponse>(
      `/deployed-triggers/${id}/webhooks`, {
        method: "GET",
        params: {
          external_user_id: externalUserId,
        },
      },
    );
  }

  /**
   * Updates the list of webhooks to which the trigger will emit events.
   *
   * @param opts - The options for updating the listening webhooks.
   * @throws If `webhookUrls` is not an array.
   * @returns A promise resolving to a list of webhooks.
   */
  public updateTriggerWebhooks(opts: UpdateTriggerWebhooksOpts) {
    const {
      id,
      externalUserId,
      webhookUrls,
    } = opts;

    if (!Array.isArray(webhookUrls)) {
      throw new Error("webhookUrls must be an array");
    }

    return this.makeConnectRequest<GetTriggerWebhooksResponse>(
      `/deployed-triggers/${id}/webhooks`, {
        method: "PUT",
        params: {
          external_user_id: externalUserId,
        },
        body: {
          webhook_urls: webhookUrls,
        },
      },
    );
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

  private addRelationOpts(params: Record<string, string>, opts?: RelationOpts, defaultLimit?: number) {
    if (opts?.limit != null) {
      params.limit = "" + opts.limit;
    }
    if (defaultLimit != null && !params.limit) {
      params.limit = "" + defaultLimit;
    }
    if (opts?.after) {
      params.after = opts.after;
    }
    if (opts?.before) {
      params.before = opts.before;
    }
  }
}
