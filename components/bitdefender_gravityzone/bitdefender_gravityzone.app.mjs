import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bitdefender_gravityzone",
  propDefinitions: {
    endpointId: {
      type: "string",
      label: "Endpoint ID",
      description: "The ID of the endpoint",
      async options({ page }) {
        const { result } = await this.listEndpoints({
          data: {
            params: {
              page: page + 1,
            },
          },
        });
        return result?.items?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group",
      async options() {
        const { result } = await this.listGroups();
        return result?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    policyId: {
      type: "string",
      label: "Policy ID",
      description: "The ID of the policy",
      async options({ page }) {
        const { result } = await this.listPolicies({
          data: {
            params: {
              page: page + 1,
            },
          },
        });
        return result?.items?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    taskId: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task",
      async options({ page }) {
        const { result } = await this.listScanTasks({
          data: {
            params: {
              page: page + 1,
            },
          },
        });
        return result?.items?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.api_url}/v1.0/jsonrpc`;
    },
    _auth() {
      return {
        username: this.$auth.api_key,
        password: "",
      };
    },
    _makeRequest({
      $ = this,
      path,
      method,
      data = {},
      ...otherOpts
    }) {
      return axios($, {
        method: "POST",
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        data: {
          ...data,
          id: "120000",
          jsonrpc: "2.0",
          method,
        },
        ...otherOpts,
      });
    },
    policiesApi({
      method, ...opts
    }) {
      return this._makeRequest({
        path: "/policies",
        method,
        ...opts,
      });
    },
    networkApi({
      method, ...opts
    }) {
      return this._makeRequest({
        path: "/network",
        method,
        ...opts,
      });
    },
    pushApi({
      method, ...opts
    }) {
      return this._makeRequest({
        path: "/push",
        method,
        ...opts,
      });
    },
    listPolicies(opts = {}) {
      return this.policiesApi({
        method: "getPoliciesList",
        ...opts,
      });
    },
    listEndpoints(opts = {}) {
      return this.networkApi({
        method: "getEndpointsList",
        ...opts,
      });
    },
    listGroups(opts = {}) {
      return this.networkApi({
        method: "getCustomGroupsList",
        ...opts,
      });
    },
    listScanTasks(opts = {}) {
      return this.networkApi({
        method: "getScanTasksList",
        ...opts,
      });
    },
    getTaskStatus(opts = {}) {
      return this.networkApi({
        method: "getTaskStatus",
        ...opts,
      });
    },
    scanEndpoint(opts = {}) {
      return this.networkApi({
        method: "createScanTask",
        ...opts,
      });
    },
    getPolicyDetails(opts = {}) {
      return this.policiesApi({
        method: "getPolicyDetails",
        ...opts,
      });
    },
    moveEndpointToGroup(opts = {}) {
      return this.networkApi({
        method: "moveEndpoints",
        ...opts,
      });
    },
    setPushEventSettings(opts = {}) {
      return this.pushApi({
        method: "setPushEventSettings",
        ...opts,
      });
    },
  },
};
