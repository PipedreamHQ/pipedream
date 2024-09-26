import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "customer_fields",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to use when creating a new customer.",
      async options() {
        const { forms } = await this.listForms();
        return forms?.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "The ID of the customer to update.",
      async options({ page }) {
        const { customers } = await this.listCustomers({
          params: {
            sort_by: "updated_at",
            sort_order: "desc",
            page,
          },
        });
        return customers?.map(({
          id: value, first_name: firstName, last_name: lastName, email,
        }) => ({
          label: `${firstName || ""} ${lastName || ""} ${email && `<${email}>` || ""}`.trim() || value,
          value,
        }));
      },
    },
  },
  methods: {
    getBaseUrl() {
      return `${constants.BASE_URL}${constants.VERSION_PATH}`;
    },
    getUrl(path, url) {
      return url || `${this.getBaseUrl()}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl(path, url),
        ...args,
      };

      return axios(step, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
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
    listForms(args = {}) {
      return this.makeRequest({
        path: "/forms",
        ...args,
      });
    },
    listDataColumns(args = {}) {
      return this.makeRequest({
        path: "/data_columns.json",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this.makeRequest({
        path: "/customers/search.json",
        ...args,
      });
    },
  },
};
