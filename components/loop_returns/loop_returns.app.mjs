import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import url from "url";

export default {
  type: "app",
  app: "loop_returns",
  propDefinitions: {
    returnId: {
      type: "string",
      label: "Return ID",
      description: "The ID of the return",
      async options({ prevContext }) {
        let cursor;
        const { nextPageUrl: nextUrl } = prevContext;

        if (nextUrl) {
          ({ cursor } = url.parse(nextUrl, true).query);
        }

        const {
          returns, nextPageUrl,
        } = await this.listReturns({
          params: {
            paginate: true,
            pageSize: constants.DEFAULT_LIMIT,
            cursor,
          },
        });

        const options = returns?.map(({
          id, order_name: order,
        }) => ({
          label: `Order ${order}`,
          value: id.toString(),
        })) || [];

        return {
          options,
          context: {
            nextPageUrl,
          },
        };
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        url: this.getUrl(path),
        headers: {
          ...headers,
          "X-Authorization": this.$auth.api_key,
        },
        ...args,
      };
      const response = await axios($, config);

      if (response?.errors) {
        throw new Error(JSON.stringify(response, null, 2));
      }

      return response;
    },
    post(args = {}) {
      return this._makeRequest({
        method: "post",
        ...args,
      });
    },
    put(args = {}) {
      return this._makeRequest({
        method: "put",
        ...args,
      });
    },
    delete(args = {}) {
      return this._makeRequest({
        method: "delete",
        ...args,
      });
    },
    listReturns(args = {}) {
      return this._makeRequest({
        path: "/warehouse/return/list",
        ...args,
      });
    },
  },
};
