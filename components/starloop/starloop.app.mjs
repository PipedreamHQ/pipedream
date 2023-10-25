import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "starloop",
  propDefinitions: {
    businessId: {
      type: "string",
      label: "Business ID",
      description: "The ID of the business",
      optional: true,
      async options() {
        const { business_id: businessId } = await this.listIds();
        return [
          businessId,
        ];
      },
    },
    profileId: {
      type: "string",
      label: "Profile ID",
      description: "The ID of the profile",
      optional: true,
      async options() {
        const { profile_ids: profileIds } = await this.listIds();
        return profileIds.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the recipient",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the recipient",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the recipient",
      optional: true,
    },
    testMode: {
      type: "boolean",
      label: "Test Mode",
      description: "If set to true, the invite will not be sent",
      optional: true,
    },
  },
  methods: {
    exportSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export(constants.SUMMARY_LABEL, msg);
    },
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getParams(params = {}) {
      return {
        token: this.$auth.api_key,
        ...params,
      };
    },
    getHeaders(headers = {}) {
      return {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json",
        ...headers,
      };
    },
    async makeRequest({
      step = this, path, headers, params, summary, ...args
    } = {}) {
      const {
        getUrl,
        getParams,
        getHeaders,
      } = this;

      const config = {
        url: getUrl(path),
        params: getParams(params),
        headers: getHeaders(headers),
        ...args,
      };

      const response = await axios(step, config);

      if (typeof summary === "function") {
        this.exportSummary(step)(summary(response));
      }

      if (response.error_msg) {
        throw new Error(JSON.stringify(response, null, 2));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    listIds(args = {}) {
      return this.post({
        path: "/list_ids",
        ...args,
      });
    },
  },
};
