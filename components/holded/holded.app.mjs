import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "holded",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document to update.",
      async options({ args }) {
        const documents = await this.listDocuments(args);
        return documents.map(({
          id: value, desc, docNumber,
        }) => ({
          label: desc || docNumber,
          value,
        }));
      },
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The payment method of the invoice.",
      async options() {
        const paymentMethods = await this.listPaymentMethods();
        return paymentMethods.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getBaseUrl(apiPath = constants.API_PATH.INVOICING.V1) {
      return `${constants.BASE_URL}${apiPath}`;
    },
    getUrl({
      path, url, apiPath,
    } = {}) {
      return url || `${this.getBaseUrl(apiPath)}${path}`;
    },
    getHeaders(headers) {
      return {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "key": this.$auth.api_key,
        ...headers,
      };
    },
    makeRequest({
      step = this, path, apiPath, headers, url, ...args
    } = {}) {

      const config = {
        headers: this.getHeaders(headers),
        url: this.getUrl({
          path,
          url,
          apiPath,
        }),
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
    listDocuments({
      docType, ...args
    } = {}) {
      return this.makeRequest({
        path: `/documents/${docType}`,
        ...args,
      });
    },
    listPaymentMethods(args = {}) {
      return this.makeRequest({
        path: "/paymentmethods",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this.makeRequest({
        path: "/contacts",
        ...args,
      });
    },
    async *getResourcesStream({
      resourceFn,
      resourceFnArgs,
    }) {
      const resources = await resourceFn(resourceFnArgs);

      if (!resources?.length) {
        console.log("No resources found");
        return;
      }

      for (const resource of resources) {
        yield resource;
      }
    },
  },
};
