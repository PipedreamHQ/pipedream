import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "triggre",
  propDefinitions: {
    listenTo: {
      type: "string",
      label: "Listen To",
      description: "The type of data change to trigger on",
      options: [
        {
          label: "Addition",
          value: "addition",
        },
        {
          label: "Modification",
          value: "modification",
        },
        {
          label: "Deletion",
          value: "deletion",
        },
      ],
    },
    flowName: {
      type: "string",
      label: "Flow Name",
      description: "The name of the automation flow to start",
    },
    flowData: {
      type: "object",
      label: "Flow Data",
      description: "The data to pass to the automation flow",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.triggre.com";
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
          Authorization: `Basic ${Buffer.from(
            `${this.$auth.username}:${this.$auth.password}`,
          ).toString("base64")}`,
        },
      });
    },
    async emitDataChange(listenTo) {
      return this._makeRequest({
        path: `/datachange/${listenTo}`,
      });
    },
    async startAutomationFlow(flowName, flowData) {
      return this._makeRequest({
        method: "POST",
        path: `/automation/${flowName}`,
        data: flowData,
      });
    },
  },
};
