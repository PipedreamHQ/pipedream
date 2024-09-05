import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "documerge",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "Identifier of a document",
      async options() {
        const { data } = await this.listDocuments();
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    routeId: {
      type: "string",
      label: "Routet ID",
      description: "Identifier of a route",
      async options() {
        const { data } = await this.listRoutes();
        return data?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.documerge.ai/api";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Authorization": `Bearer ${this.$auth.api_token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        path: "/documents",
        ...opts,
      });
    },
    listRoutes(opts = {}) {
      return this._makeRequest({
        path: "/routes",
        ...opts,
      });
    },
    getDocumentFields({
      documentId, ...opts
    }) {
      return this._makeRequest({
        path: `/documents/fields/${documentId}`,
        ...opts,
      });
    },
    combineFiles(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tools/combine",
        responseType: "arraybuffer",
        ...opts,
      });
    },
    convertToPdf(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/tools/pdf/convert",
        responseType: "arraybuffer",
        ...opts,
      });
    },
    createDocumentDeliveryMethod({
      documentId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/delivery-methods/${documentId}`,
        ...opts,
      });
    },
    deleteDocumentDeliveryMethod({
      documentId, deliveryMethodId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/documents/delivery-methods/${documentId}/${deliveryMethodId}`,
        ...opts,
      });
    },
    createRouteDeliveryMethod({
      routeId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/routes/delivery-methods/${routeId}`,
        ...opts,
      });
    },
    deleteRouteDeliveryMethod({
      routeId, deliveryMethodId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/routes/delivery-methods/${routeId}/${deliveryMethodId}`,
        ...opts,
      });
    },
  },
};
