import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "poper",
  propDefinitions: {
    poperId: {
      type: "string",
      label: "Poper ID",
      description: "The ID of the Poper popup",
      async options() {
        const popups = await this.listPopups();
        return popups.map((popup) => ({
          label: popup.name,
          value: popup.id,
        }));
      },
    },
    apiKey: {
      type: "string",
      label: "API Key",
      description: "Your Poper API Key",
      secret: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.poper.ai/general/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    async listPopups() {
      return this._makeRequest({
        path: "/popup/list",
        data: `api_key=${this.$auth.api_key}`,
      });
    },
    async getPopupResponses({ poperId }) {
      return this._makeRequest({
        path: "/popup/responses",
        data: `api_key=${this.$auth.api_key}&popup_id=${poperId}`,
      });
    },
    async emitNewLeadEvent({ poperId }) {
      const responses = await this.getPopupResponses({
        poperId,
      });
      responses.responses.forEach((response) => {
        this.$emit(response, {
          summary: `New lead from Poper ID: ${poperId}`,
          id: response.id,
        });
      });
    },
  },
};
