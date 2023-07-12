import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "facebook_lead_ads",
  propDefinitions: {
    pageId: {
      type: "string",
      label: "Page ID",
      description: "The ID of the page to retrieve forms from.",
      async options({ prevContext }) {
        const params = {
          after: prevContext?.nextPage,
        };
        const res = await this.listPages(params);
        return {
          options: res.data.map((form) => ({
            label: form.name,
            value: form.id,
          })),
          context: {
            nextPage: res.paging?.cursors?.after,
          },
        };
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to retrieve leads from.",
      async options({
        prevContext,
        pageId,
      }) {
        if (!pageId) {
          return [];
        }
        const params = {
          after: prevContext?.nextPage,
        };

        const res = await this.listForms(
          pageId,
          params,
          await this._getPageAccessToken(pageId),
        );
        return {
          options: res.data.map((form) => ({
            label: form.name,
            value: form.id,
          })),
          context: {
            nextPage: res.paging?.cursors?.after,
          },
        };
      },
    },
  },
  methods: {
    _getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _getApiVersion() {
      return "v17.0";
    },
    _getBaseUrl() {
      return `https://graph.facebook.com/${this._getApiVersion()}`;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
        params: {
          ...opts.params,
          access_token: opts.overrideAccessToken ?? this._getAccessToken(),
        },
      };
      return axios(ctx, axiosOpts);
    },
    async _getAllPages() {
      const data = [];
      let res;
      let after = undefined;
      do {
        const params = {
          after,
        };
        res = await this.listPages(params);
        data.push(...res.data);
        after = res.paging?.cursors?.after;
      } while (res.paging.next);

      return data;
    },
    // Form Id must be fetched with page id. Since we cant store more than one value in
    // an assync option, we need to fetch the page id from the previous step.
    async _getPageAccessToken(pageId) {
      const allPages = await this._getAllPages();
      const page = allPages.find((page) => page.id === pageId);
      if (!page) {
        throw new Error(`Page with id ${pageId} not found`);
      }
      return page.access_token;
    },
    async listLeadsByAdOrFormId(id, params) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/${id}/leads`,
        params,
      });
    },
    async getLeadById(id) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/${id}`,
      });
    },
    async listForms(pageId, params, overrideAccessToken) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/${pageId}/leadgen_forms`,
        params,
        overrideAccessToken,
      });
    },
    async listPages(params) {
      return this._makeHttpRequest({
        method: "GET",
        path: "/me/accounts",
        params,
      });
    },
  },
};
