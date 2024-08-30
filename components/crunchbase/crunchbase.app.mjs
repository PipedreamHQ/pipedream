import { axios } from "@pipedream/platform";
import {
  FIELDS_OPTIONS, LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "crunchbase",
  propDefinitions: {
    entityId: {
      type: "string",
      label: "Entity ID",
      description: "UUID or permalink of the desired entity",
      async options({ prevContext }) {
        const { entities } = await this.searchOrganizations({
          data: {
            field_ids: FIELDS_OPTIONS,
            limit: LIMIT,
            after_id: prevContext.lastId,
          },
        });

        return {
          options: entities.map(({
            uuid, properties: { name },
          }) => ({
            label: name,
            value: uuid,
          })),
          context: {
            lastId: entities[entities.length - 1].uuid,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.crunchbase.com/v4/data";
    },
    _headers() {
      return {
        "X-cb-user-key": this.$auth.user_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    getOrganizationDetails({
      entityId, ...opts
    }) {
      return this._makeRequest({
        path: `/entities/organizations/${entityId}`,
        ...opts,
      });
    },
    searchOrganizations(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/searches/organizations",
        ...opts,
      });
    },
  },
};
