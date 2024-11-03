import { axios } from "@pipedream/platform";
import xml2js from "xml2js";

export default {
  type: "app",
  app: "gocanvas",
  propDefinitions: {
    dispatchId: {
      type: "string",
      label: "Dispatch ID",
      description: "Identifier of a dispatch",
      async options({ page }) {
        const dispatches = await this.getActiveDispatches({
          data: {
            page: page + 1,
          },
        });
        return dispatches?.map(({
          $, Description: desc,
        }) => ({
          value: $.Id,
          label: desc[0],
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.gocanvas.com/apiv2/";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        params,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        params: {
          ...params,
          username: `${this.$auth.username}`,
        },
        headers: {
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getActiveDispatches(opts = {}) {
      const response = await this._makeRequest({
        path: "/dispatch_export",
        ...opts,
      });
      const { CanvasResult: { Dispatches: dispatches } } = await new xml2js
        .Parser().parseStringPromise(response);
      const dispatchList = [];
      for (const dispatch of dispatches) {
        if (!dispatch.Dispatch) {
          continue;
        }
        const activeDispatches = dispatch.Dispatch.filter((d) => d.Status[0] !== "deleted");
        dispatchList.push(...activeDispatches);
      }
      return dispatchList;
    },
    async getDispatchDescription({
      dispatchId, ...opts
    }) {
      const dispatches = await this.getActiveDispatches({
        ...opts,
      });
      const dispatch = dispatches.find(({ $ }) => $.Id === dispatchId);
      return dispatch.Description[0];
    },
    dispatchItems(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/dispatch_items",
        ...opts,
      });
    },
  },
};
