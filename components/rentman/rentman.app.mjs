import { axios } from "@pipedream/platform";
import {
  ITEM_TYPE_OPTIONS, LIMIT,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "rentman",
  propDefinitions: {
    itemType: {
      type: "string",
      label: "Item Type",
      description: "The type of item",
      options: ITEM_TYPE_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rentman.net/";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
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
    createItem({
      itemType, parentId, ...opts
    }) {
      const parentNames = {
        "costs": "projects",
        "crewavailability": "crew",
        "payments": "invoices",
        "contactpersons": "contacts",
        "projectrequestequipment": "projectrequests",
        "stockmovements": "equipment",
      };
      const parentName = parentNames[itemType];

      return this._makeRequest({
        method: "POST",
        path: parentName
          ? `${parentName}/${parentId}/${itemType}`
          : itemType,
        ...opts,
      });
    },
    updateItem({
      itemType, itemId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `${itemType}/${itemId}`,
        ...opts,
      });
    },
    getItem({
      itemType, itemId,
    }) {
      return this._makeRequest({
        path: `${itemType}/${itemId}`,
      });
    },
    listItems(path, opts) {
      return this._makeRequest({
        path,
        ...opts,
      });
    },
    listSubprojects({ projectId }) {
      return this._makeRequest({
        path: `projects/${projectId}/subprojects`,
      });
    },
    async asyncOpt({
      page, fn, returnType = null, filterFunction = null,
    }) {
      let { data } = await fn({
        params: {
          limit: LIMIT,
          offset: LIMIT * page,
        },
      });

      if (filterFunction) {
        data = data.filter(filterFunction);
      }

      return data.map(({
        id, displayname: label,
      }) => ({
        label,
        value: returnType
          ? `/${returnType}/${id}`
          : id,
      }));
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page++;
        const { data } = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
