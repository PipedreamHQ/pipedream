import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "gtmetrix",
  propDefinitions: {
    locationId: {
      type: "string",
      label: "Location",
      description: "Identifier of a location. Visit the [Locations Page](https://gtmetrix.com/locations.html) for more information on Basic and Premium test locations.",
      optional: true,
      async options() {
        const { data } = await this.listLocations();
        return data?.map(({
          id: value, attributes,
        }) => ({
          value,
          label: attributes.name,
        })) || [];
      },
    },
    browserId: {
      type: "string",
      label: "Browser",
      description: "Identifier of a browser",
      optional: true,
      async options() {
        const { data } = await this.listBrowsers();
        return data?.map(({
          id: value, attributes,
        }) => ({
          value,
          label: attributes.name,
        })) || [];
      },
    },
    pageId: {
      type: "string",
      label: "Page",
      description: "Identifier of a page",
      async options({ page }) {
        const { data } = await this.listPages({
          params: {
            "page[number]": page + 1,
          },
        });
        return data?.map(({
          id: value, attributes,
        }) => ({
          value,
          label: attributes.url,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://gtmetrix.com/api/2.0";
    },
    _headers() {
      return {
        "Content-Type": "application/vnd.api+json",
      };
    },
    _auth() {
      return {
        username: `${this.$auth.api_key}`,
        password: "",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        auth: this._auth(),
        ...args,
      });
    },
    getTest({
      testId, ...args
    }) {
      return this._makeRequest({
        path: `/tests/${testId}`,
        ...args,
      });
    },
    listTests(args = {}) {
      return this._makeRequest({
        path: "/tests",
        ...args,
      });
    },
    listLocations(args = {}) {
      return this._makeRequest({
        path: "/locations",
        ...args,
      });
    },
    listBrowsers(args = {}) {
      return this._makeRequest({
        path: "/browsers",
        ...args,
      });
    },
    listPages(args = {}) {
      return this._makeRequest({
        path: "/pages",
        ...args,
      });
    },
    getLatestReport({
      pageId, ...args
    }) {
      return this._makeRequest({
        path: `/pages/${pageId}/latest-report`,
        ...args,
      });
    },
    startTest(args = {}) {
      return this._makeRequest({
        path: "/tests",
        method: "POST",
        ...args,
      });
    },
    async *paginate({
      resourceFn, args,
    }) {
      const limit = constants.DEFAULT_LIMIT;
      args = {
        ...args,
        "page[size]": limit,
        "page[number]": 1,
      };
      let total = 0;
      do {
        const { data } = await resourceFn(args);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
        }
        total = data?.length;
        args["page[number]"]++;
      } while (total === limit);
    },
  },
};
