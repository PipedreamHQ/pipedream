import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "crunchbase",
  propDefinitions: {
    entityId: {
      type: "string",
      label: "Entity ID",
      description: "UUID or permalink of the desired entity",
      async options() {
        const entities = await this.searchOrganizations({
          query: [
            {
              field_id: "identifier",
              operator: "exists",
            },
          ],
        });
        return entities.map((entity) => ({
          label: entity.properties.name,
          value: entity.uuid,
        }));
      },
    },
    fieldIds: {
      type: "string[]",
      label: "Field IDs",
      description: "Fields to include on the resulting entity",
      optional: true,
    },
    order: {
      type: "object[]",
      label: "Order",
      description: "Order in which the search results should be returned",
      optional: true,
    },
    query: {
      type: "object[]",
      label: "Query",
      description: "Query for searching organizations",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.crunchbase.com/v4/data";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
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
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getOrganizationDetails({
      entityId, fieldIds,
    }) {
      return this._makeRequest({
        path: `/entities/organizations/${entityId}`,
        params: {
          field_ids: fieldIds
            ? fieldIds.join(",")
            : undefined,
        },
      });
    },
    async searchOrganizations({
      fieldIds, order, query,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/searches/organizations",
        data: {
          field_ids: fieldIds,
          order,
          query,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
