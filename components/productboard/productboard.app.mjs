import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "productboard",
  propDefinitions: {
    feature: {
      type: "string",
      label: "Feature",
      description: "The identifier of the feature to retrieve",
      async options({ prevContext }) {
        return this.getPaginatedOptions(prevContext?.next, this.listFeatures);
      },
    },
    featureStatus: {
      type: "string",
      label: "Status",
      description: "If specified, only return features with the given status",
      async options({ prevContext }) {
        return this.getPaginatedOptions(prevContext?.next, this.listFeatureStatuses);
      },
    },
    component: {
      type: "string",
      label: "Component",
      description: "Parent component of the new feature",
      async options({ prevContext }) {
        return this.getPaginatedOptions(prevContext?.next, this.listComponents);
      },
    },
    product: {
      type: "string",
      label: "Product",
      description: "Parent product of the new feature",
      async options({ prevContext }) {
        return this.getPaginatedOptions(prevContext?.next, this.listProducts);
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The feature name",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the feature. The format is a limited subset of HTML defined by [this XML schema](https://developer.productboard.com/files/schema.xsd). Example: `<p>Featue description</p>`",
    },
    parentType: {
      type: "string",
      label: "Parent Type",
      description: "Type of the parent of the feature. Can be either a feature, a component or a product.",
      options: [
        "feature",
        "component",
        "product",
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.productboard.com/";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "X-Version": 1,
      };
    },
    async _makeRequest(args) {
      const {
        method = "GET",
        url,
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async getPaginatedOptions(next, resourceFn) {
      const {
        data, links,
      } = next
        ? await this.getTarget(next)
        : await resourceFn();
      const options = data
        .filter((item) => item.name && item.id)
        .map((item) => ({
          label: item.name,
          value: item.id,
        }));
      return {
        options,
        context: {
          next: links?.next,
        },
      };
    },
    async createHook(data) {
      return this._makeRequest({
        method: "POST",
        path: "webhooks",
        data,
      });
    },
    async deleteHook(id) {
      return this._makeRequest({
        method: "DELETE",
        path: `webhooks/${id}`,
      });
    },
    async getTarget(targetUrl) {
      return this._makeRequest({
        url: targetUrl,
      });
    },
    async getFeature(id) {
      return this._makeRequest({
        path: `features/${id}`,
      });
    },
    async listComponents(params = {}) {
      return this._makeRequest({
        path: "components",
        params,
      });
    },
    async listProducts(params = {}) {
      return this._makeRequest({
        path: "products",
        params,
      });
    },
    async listFeatures(params = {}) {
      return this._makeRequest({
        path: "features",
        params,
      });
    },
    async listFeatureStatuses() {
      return this._makeRequest({
        path: "feature-statuses",
      });
    },
    async createFeature(data = {}) {
      return this._makeRequest({
        method: "POST",
        path: "features",
        data,
      });
    },
    async createNote(data = {}) {
      return this._makeRequest({
        method: "POST",
        path: "notes",
        data,
      });
    },
    async updateFeature(id, data = {}) {
      return this._makeRequest({
        method: "PATCH",
        path: `features/${id}`,
        data,
      });
    },
  },
};
