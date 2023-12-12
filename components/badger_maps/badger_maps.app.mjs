import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "badger_maps",
  propDefinitions: {
    accountId: {
      type: "string",
      label: "Account ID",
      description: "The ID of the account.",
      async options() {
        const resources = await this.listCustomers();
        return resources.map(({
          id: value,
          last_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the account.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the account owner.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the account owner.",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the account.",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the account.",
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(passingHeaders, data) {
      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Token ${this.$auth.api_key}`,
        ...passingHeaders,
      };
      return !data
        ? headers
        : {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded",
        };
    },
    makeRequest({
      step = this, path, headers, url, data: dataObj, ...args
    } = {}) {
      const data = utils.encodeData(dataObj);
      const config = {
        headers: this.getHeaders(headers, data),
        url: this.getUrl(path, url),
        data,
        ...args,
      };
      console.log("config", config);
      return axios(step, config);
    },
    create(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    update(args = {}) {
      return this.makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this.makeRequest({
        method: "delete",
        ...args,
      });
    },
    patch(args = {}) {
      return this.makeRequest({
        method: "patch",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this.makeRequest({
        path: "/customers/",
        ...args,
      });
    },
    listCheckIns(args = {}) {
      return this.makeRequest({
        path: "/appointments/",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn, resourceFnArgs, lastLogDateTime,
    }) {
      const nextResources = await resourceFn(resourceFnArgs);

      if (!nextResources?.length) {
        console.log("No resources found");
        return;
      }

      for (const resource of nextResources) {
        const dateFilter =
          lastLogDateTime
          && Date.parse(resource.log_datetime) > Date.parse(lastLogDateTime);

        if (!lastLogDateTime || dateFilter) {
          yield resource;
        }
      }
    },
  },
};
