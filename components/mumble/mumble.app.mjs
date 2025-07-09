import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mumble",
  propDefinitions: {
    labelName: {
      type: "string",
      label: "Label Name",
      description: "Name of the label",
    },
    customerPhone: {
      type: "string",
      label: "Customer Phone",
      description: "Phone number of the customer",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address",
      optional: true,
    },
    source: {
      type: "string",
      label: "Source",
      description: "Source identifier",
      optional: true,
    },
    utmSource: {
      type: "string",
      label: "UTM Source",
      description: "UTM source value",
      optional: true,
    },
    utmMedium: {
      type: "string",
      label: "UTM Medium",
      description: "UTM medium value",
      optional: true,
    },
    utmCampaign: {
      type: "string",
      label: "UTM Campaign",
      description: "UTM campaign value",
      optional: true,
    },
    gclid: {
      type: "string",
      label: "GCLID",
      description: "Google Ads click ID",
      optional: true,
    },
    currentUrl: {
      type: "string",
      label: "Current URL",
      description: "Current URL",
      optional: true,
    },
    labelNameList: {
      type: "string",
      label: "Label Name",
      description: "Name of the label",
      async options() {
        const response = await this.getLabels();
        const labelsArray = response.labels;
        return labelsArray.map((label) => ({
          value: label,
          label: label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.mumble.co.il/mumbleapi";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "mumble-api-key": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async addNewLabel(args = {}) {
      return this._makeRequest({
        path: "/add-new-label",
        method: "post",
        ...args,
      });
    },
    async deleteLabel(args = {}) {
      return this._makeRequest({
        path: "/delete-label",
        method: "delete",
        ...args,
      });
    },
    async addNewCustomer(args = {}) {
      return this._makeRequest({
        path: "/add-new-customer",
        method: "post",
        ...args,
      });
    },
    async editCustomer(args = {}) {
      return this._makeRequest({
        path: "/edit-customer",
        method: "post",
        ...args,
      });
    },
    async getLabels(args = {}) {
      return this._makeRequest({
        path: "/get-labels",
        ...args,
      });
    },
  },
};
