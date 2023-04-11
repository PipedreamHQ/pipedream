import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "drata",
  propDefinitions: {
    controlId: {
      type: "string",
      label: "Control ID",
      description: "The ID of the control.",
      async options({ page }) {
        const response = await this.listControls({
          params: {
            page: ++page,
          },
        });
        return response.data.map((control) => ({
          label: control.name,
          value: control.id,
        }));
      },
    },
  },
  methods: {
    async _makeRequest({
      $ = this, path = "/", ...opts
    }) {
      return axios($, {
        ...opts,
        url: `https://public-api.drata.com/public${path}`,
        headers: {
          ...opts.headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async paginate({
      fn, ...opts
    }) {
      const { total } = await fn.call(this, {
        ...opts,
        params: {
          ...opts.params,
          limit: 1,
        },
      });

      const promises = [];
      const numberOfPages = Math.ceil(total / constants.PAGINATION_LIMIT);
      for (let page = 1; page <= numberOfPages; page++) {
        promises.push(fn.call(this, {
          ...opts,
          params: {
            ...opts.params,
            limit: constants.PAGINATION_LIMIT,
            page,
          },
        }));
      }

      const responses = await Promise.all(promises);
      const results = responses.reduce((results, { data }) => ([
        ...results,
        ...data,
      ]), []);

      return {
        data: results,
        page: numberOfPages,
        total,
      };
    },
    async listPersonnel({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listPersonnel,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/personnel",
      });
    },
    async listAssets({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listAssets,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/assets",
      });
    },
    async listControls({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listControls,
        });
      }
      return this._makeRequest({
        ...opts,
        path: "/controls",
      });
    },
    async listEvidencesForControl({
      controlId, paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          controlId,
          fn: this.listEvidencesForControl,
        });
      }
      return this._makeRequest({
        ...opts,
        path: `/controls/${controlId}/external-evidence`,
      });
    },
    async listVendors({
      paginate = false, ...opts
    }) {
      if (paginate) {
        return this.paginate({
          ...opts,
          fn: this.listVendors,
        });
      }
      return this._makeRequest({
        path: "/vendors",
      });
    },
  },
};
