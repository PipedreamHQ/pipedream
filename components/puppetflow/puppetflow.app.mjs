import { axios } from "@pipedream/platform";
import {
  API_PATH,
  DEFAULT_LIMIT,
  FLOW_TYPES,
  MAX_LIMIT,
  RUN_STATUSES,
} from "./common/constants.mjs";
import { normalizeBaseUrl } from "./common/utils.mjs";

export default {
  type: "app",
  app: "puppetflow",
  propDefinitions: {
    flowId: {
      type: "string",
      label: "Flow",
      description: "The ID of the Puppetflow flow, e.g. `flow_k8Zt3xQ9mA2f`."
        + " Use **List Flows** to find it (the `id` field).",
      async options({ search }) {
        const flows = await this.listFlows({
          params: {
            search,
            limit: MAX_LIMIT,
          },
        });
        return flows.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    runId: {
      type: "integer",
      label: "Run",
      description: "The numeric ID of the run, e.g. `42`."
        + " Returned as `run_id` by **Trigger Flow**, or use **List Runs** to find it (the `id` field)."
        + " Must belong to the flow given in `flowId`.",
      async options({ flowId }) {
        const runs = await this.searchRuns({
          flowId,
        });
        return runs.map(({
          id, status, created_at: createdAt,
        }) => ({
          label: `#${id} - ${status} (${createdAt})`,
          value: id,
        }));
      },
    },
    folderId: {
      type: "string",
      label: "Folder",
      description: "Only return flows stored in this folder, e.g. `fld_R7mP2qX9vK4c`.",
      optional: true,
      async options({ search }) {
        const folders = await this.listFolders({
          params: {
            search,
          },
        });
        return folders.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    flowType: {
      type: "string",
      label: "Flow Type",
      description: "Only return flows of this type. One of `code`, `nodal`. e.g. `code`.",
      optional: true,
      options: FLOW_TYPES,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Only return runs with this status."
        + " One of `pending`, `running`, `success`, `error`, `cancelled`. e.g. `success`.",
      optional: true,
      options: RUN_STATUSES,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: `The maximum number of items to return, e.g. \`${DEFAULT_LIMIT}\`. Defaults to \`${DEFAULT_LIMIT}\`.`,
      optional: true,
      default: DEFAULT_LIMIT,
      min: 1,
    },
    includeLogs: {
      type: "boolean",
      label: "Include Logs",
      description: "Set to `true` to include the `console_logs` array of the run in the response. e.g. `false`.",
      optional: true,
      default: false,
    },
    includeCode: {
      type: "boolean",
      label: "Include Code Snapshot",
      description: "Set to `true` to include the `code_snapshot` of the flow as it was when the run started. e.g. `false`.",
      optional: true,
      default: false,
    },
  },
  methods: {
    /**
     * Builds the base URL of the REST API from the instance URL stored in the connected account.
     * @returns {string} The API base URL, e.g. `https://acme.puppetflow.com/api/v1`.
     */
    _baseUrl() {
      return `${normalizeBaseUrl(this.$auth.instance_url)}${API_PATH}`;
    },
    /**
     * Performs an authenticated request against the Puppetflow REST API.
     * @param {object} args - Request options.
     * @param {object} [args.$] - The Pipedream step context, used for logging and error
     * propagation.
     * @param {string} args.path - The path relative to the API base URL, e.g. `/flows`.
     * @param {object} [args.headers] - Additional headers merged with the auth headers.
     * @returns {Promise<any>} The parsed response body.
     */
    _makeRequest({
      $ = this, path, headers, ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
          ...headers,
        },
        ...args,
      });
    },
    /**
     * Lists the flows accessible to the API key.
     * @param {object} [args] - Request options. Supports `params.search`, `params.name`,
     * `params.type`, `params.folder_id` and `params.limit`.
     * @returns {Promise<object[]>} The list of flows.
     */
    listFlows(args = {}) {
      return this._makeRequest({
        path: "/flows",
        ...args,
      });
    },
    /**
     * Lists the folders accessible to the API key.
     * @param {object} [args] - Request options. Supports `params.search`.
     * @returns {Promise<object[]>} The list of folders.
     */
    listFolders(args = {}) {
      return this._makeRequest({
        path: "/folders",
        ...args,
      });
    },
    /**
     * Dispatches a new run of a flow. The call returns immediately with a pending run.
     * @param {object} args - Request options.
     * @param {string} args.flowId - The flow ID.
     * @param {object} [args.data] - The JSON input merged into `$input` of the flow.
     * @returns {Promise<{run_id: number, flow_id: string, status: string}>} The created run
     * reference.
     */
    triggerFlow({
      flowId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/flows/${flowId}/trigger`,
        ...args,
      });
    },
    /**
     * Lists the runs of a flow, most recent first, one page at a time.
     * @param {object} args - Request options.
     * @param {string} args.flowId - The flow ID.
     * @param {object} [args.params] - Supports `status`, `per_page`, `page`, `logs` and `code`.
     * @returns {Promise<{data: object[], current_page: number, last_page: number, total: number}>}
     * A page of runs.
     */
    listRuns({
      flowId, ...args
    }) {
      return this._makeRequest({
        path: `/flows/${flowId}/runs`,
        ...args,
      });
    },
    /**
     * Searches runs of a flow and returns a lightweight list suitable for autocomplete.
     * @param {object} args - Request options.
     * @param {string} args.flowId - The flow ID.
     * @param {object} [args.params] - Supports `search` and `status`.
     * @returns {Promise<object[]>} The matching runs.
     */
    searchRuns({
      flowId, ...args
    }) {
      return this._makeRequest({
        path: `/flows/${flowId}/runs/search`,
        ...args,
      });
    },
    /**
     * Searches runs across every flow visible to the API key, most recent first, one page at a
     * time.
     * @param {object} [args] - Request options. Supports `params.flow_id`, `params.statuses[]`,
     * `params.date_from`, `params.per_page` and `params.page`.
     * @returns {Promise<{data: object[], current_page: number, last_page: number, total: number}>}
     * A page of runs.
     */
    searchAllRuns(args = {}) {
      return this._makeRequest({
        path: "/runs/search",
        ...args,
      });
    },
    /**
     * Retrieves the full details of a run, including its human validation state and artifact links.
     * @param {object} args - Request options.
     * @param {string} args.flowId - The flow ID.
     * @param {number} args.runId - The run ID.
     * @param {object} [args.params] - Supports `logs` and `code`.
     * @returns {Promise<object>} The run.
     */
    getRun({
      flowId, runId, ...args
    }) {
      return this._makeRequest({
        path: `/flows/${flowId}/runs/${runId}`,
        ...args,
      });
    },
    /**
     * Retrieves only the status, output, error message and duration of a run.
     * @param {object} args - Request options.
     * @param {string} args.flowId - The flow ID.
     * @param {number} args.runId - The run ID.
     * @returns {Promise<{run_id: number, status: string, output: any, error_message: string|null,
     * duration_ms: number|null}>} The run result.
     */
    getRunResult({
      flowId, runId, ...args
    }) {
      return this._makeRequest({
        path: `/flows/${flowId}/runs/${runId}/result`,
        ...args,
      });
    },
    /**
     * Resumes a run paused by `$waitHumanValidation()`.
     * @param {object} args - Request options.
     * @param {string} args.flowId - The flow ID.
     * @param {number} args.runId - The run ID.
     * @param {object} args.data - The request body, containing `wait_id`.
     * @returns {Promise<{run_id: number, status: string, continue_requested: boolean}>} The
     * continuation acknowledgement.
     */
    continueRun({
      flowId, runId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/flows/${flowId}/runs/${runId}/continue`,
        ...args,
      });
    },
    /**
     * Iterates over paginated runs, yielding one run at a time until `max` items or the last
     * page is reached.
     * @param {object} args - Pagination options.
     * @param {Function} args.fn - The paginated app method to call, e.g. `listRuns` or
     * `searchAllRuns`.
     * @param {object} [args.args] - Arguments forwarded to `fn`. `params.page` and
     * `params.per_page` are managed here.
     * @param {number} [args.max] - The maximum number of items to yield.
     * @yields {object} A run.
     */
    async *paginate({
      fn, args = {}, max,
    }) {
      let page = 1;
      let lastPage = 1;
      let count = 0;
      do {
        const response = await fn({
          ...args,
          params: {
            ...args.params,
            per_page: MAX_LIMIT,
            page,
          },
        });
        for (const item of response.data ?? []) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        lastPage = response.last_page ?? page;
        page++;
      } while (page <= lastPage);
    },
  },
};
