import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flowiseai",
  propDefinitions: {
    flow: {
      type: "string",
      label: "Flow ID",
      description: "The unique identifier of the flow you'd like to use for computations.",
      async options() {
        const flows = await this.listFlows();
        return flows.map((flow) => ({
          label: flow.name,
          value: flow.id,
        }));
      },
    },
    variables: {
      type: "object",
      label: "Variables",
      description: "Optional variables to be used in prediction processing.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flowiseai.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listFlows() {
      return this._makeRequest({
        path: "/flows",
      });
    },
    async calculateOutput({
      flowId, variables,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/flows/${flowId}/calculate`,
        data: variables,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
