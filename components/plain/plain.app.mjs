import { axios } from "@pipedream/platform";
import queries from "./common/queries.mjs";

export default {
  type: "app",
  app: "plain",
  propDefinitions: {
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "Identifier of a customer",
      async options({ prevContext }) {
        return this.getPropOptions(prevContext, "getCustomers", "customers", "id", "fullName");
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Identifier of a user to assign the thread to",
      optional: true,
      async options({ prevContext }) {
        return this.getPropOptions(prevContext, "getUsers", "users", "id", "fullName");
      },
    },
    labelTypeIds: {
      type: "string[]",
      label: "Label Type IDs",
      description: "Array of label type identifiers",
      optional: true,
      async options({ prevContext }) {
        return this.getPropOptions(prevContext, "labelTypes", "labelTypes", "id", "name");
      },
    },
    groupKey: {
      type: "string",
      label: "Group Key",
      description: "Key identifier of a customer group",
      async options({ prevContext }) {
        return this.getPropOptions(prevContext, "customerGroups", "customerGroups", "key", "name");
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://core-api.uk.plain.com/graphql/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}`,
        headers: this._headers(),
        ...args,
      });
    },
    async post(args = {}) {
      return this._makeRequest({
        method: "POST",
        ...args,
      });
    },
    async getPropOptions(prevContext, queryType, resourceType, valueKey, labelKey) {
      const data = {
        query: queries[queryType],
      };
      if (prevContext.cursor) {
        data.variables = {
          cursor: prevContext.cursor,
        };
      }
      const { data: response } = await this.post({
        data,
      });
      const edges = response[resourceType].edges;
      const pageInfo = response[resourceType].pageInfo;
      const options = edges.map(({ node }) => ({
        value: node[valueKey],
        label: node[labelKey],
      }));
      return {
        options,
        context: {
          cursor: pageInfo.hasNextPage
            ? pageInfo.endCursor
            : undefined,
        },
      };
    },
  },
};
