import { axios } from "@pipedream/platform";

const MAX_PAGE_SIZE = 100;

export default {
  type: "app",
  app: "oneflow",
  propDefinitions: {
    userEmail: {
      type: "string",
      label: "User Email",
      description: "The email address of an active Oneflow user to act as, e.g. `jane@example.com`. Without it, Oneflow treats the request as an anonymous admin, so set it to apply that user's permissions. Use **List Users** to find it (the `email` field).",
      optional: true,
    },
    contractId: {
      type: "integer",
      label: "Contract ID",
      description: "The ID of the contract, e.g. `10015`. Use **List Contracts** to find it (the `id` field).",
      async options({
        page, userEmail,
      }) {
        const { data } = await this.listContracts({
          userEmail,
          params: {
            limit: MAX_PAGE_SIZE,
            offset: page * MAX_PAGE_SIZE,
          },
        });
        return this._toOptions(data);
      },
    },
    workspaceId: {
      type: "integer",
      label: "Workspace ID",
      description: "The ID of the workspace, e.g. `12345`. Use **List Workspaces** to find it (the `id` field).",
      async options({
        page, userEmail,
      }) {
        const { data } = await this.listWorkspaces({
          userEmail,
          params: {
            limit: MAX_PAGE_SIZE,
            offset: page * MAX_PAGE_SIZE,
          },
        });
        return this._toOptions(data);
      },
    },
    templateId: {
      type: "integer",
      label: "Template ID",
      description: "The ID of the template, e.g. `54321`. Use **List Templates** to find it (the `id` field).",
      async options({
        page, userEmail, workspaceId,
      }) {
        const { data } = await this.listTemplates({
          userEmail,
          params: {
            "filter[workspace_ids]": workspaceId,
            "limit": MAX_PAGE_SIZE,
            "offset": page * MAX_PAGE_SIZE,
          },
        });
        return this._toOptions(data);
      },
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The most records to return, e.g. `50`. Defaults to `100`.",
      default: 100,
      min: 1,
      optional: true,
    },
  },
  methods: {
    _toOptions(records) {
      return records.map(({
        id: value, name: label,
      }) => ({
        label,
        value,
      }));
    },
    _makeRequest({
      $ = this, userEmail, headers, ...args
    }) {
      return axios($, {
        baseURL: this.$auth.api_url,
        headers: {
          "X-Oneflow-API-Token": this.$auth.api_token,
          "X-Oneflow-User-Email": userEmail,
          ...headers,
        },
        ...args,
      });
    },
    /**
     * Fetch records across pages, up to a limit.
     * @param {object} opts
     * @param {function} opts.fn - The list method to call
     * @param {object} [opts.params] - Query params sent with each request
     * @param {number} [opts.maxResults=100] - The most records to return
     * @returns {Promise<object[]>} The records
     */
    async paginate({
      fn, params, maxResults = 100, ...args
    }) {
      const records = [];
      const limit = Math.min(maxResults, MAX_PAGE_SIZE);
      let pageSize;
      do {
        const { data } = await fn.call(this, {
          ...args,
          params: {
            ...params,
            limit,
            offset: records.length,
          },
        });
        records.push(...data);
        pageSize = data.length;
      } while (pageSize === limit && records.length < maxResults);
      return records.slice(0, maxResults);
    },
    /**
     * Fetch one page of contracts.
     * @param {object} [args] - Request options, such as `$`, `userEmail` and `params`
     * @returns {Promise<object>} The page, with records in `data`
     */
    listContracts(args = {}) {
      return this._makeRequest({
        url: "/contracts",
        ...args,
      });
    },
    /**
     * Fetch one contract.
     * @param {object} opts
     * @param {number} opts.contractId - The contract ID
     * @returns {Promise<object>} The contract
     */
    getContract({
      contractId, ...args
    }) {
      return this._makeRequest({
        url: `/contracts/${contractId}`,
        ...args,
      });
    },
    /**
     * Create a draft contract from a template.
     * @param {object} [args] - Request options, with the contract in `data`
     * @returns {Promise<object>} The created contract
     */
    createContract(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "/contracts/create",
        ...args,
      });
    },
    /**
     * Fetch one page of workspaces.
     * @param {object} [args] - Request options, such as `$`, `userEmail` and `params`
     * @returns {Promise<object>} The page, with records in `data`
     */
    listWorkspaces(args = {}) {
      return this._makeRequest({
        url: "/workspaces",
        ...args,
      });
    },
    /**
     * Fetch one page of templates.
     * @param {object} [args] - Request options, such as `$`, `userEmail` and `params`
     * @returns {Promise<object>} The page, with records in `data`
     */
    listTemplates(args = {}) {
      return this._makeRequest({
        url: "/templates",
        ...args,
      });
    },
    /**
     * Fetch one page of users.
     * @param {object} [args] - Request options, such as `$` and `params`
     * @returns {Promise<object>} The page, with records in `data`
     */
    listUsers(args = {}) {
      return this._makeRequest({
        url: "/users",
        ...args,
      });
    },
  },
};
