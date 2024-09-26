import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gravity_forms",
  propDefinitions: {
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form for which to create or get entries.",
      async options() {
        const response = await this.listForms();

        const forms = Object.keys(response)
          .map((key) => response[key]);

        return  forms.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.base_api_url}/wp-json/gf/v2`;
    },
    _auth() {
      return {
        "username": `${this.$auth.consumer_key}`,
        "password": `${this.$auth.consumer_secret}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        auth: this._auth(),
        ...opts,
      });
    },
    listForms(opts = {}) {
      return this._makeRequest({
        path: "/forms",
        ...opts,
      });
    },
    listEntries({
      formId, ...opts
    }) {
      return this._makeRequest({
        path: `/forms/${formId}/entries`,
        ...opts,
      });
    },
    createEntry({
      formId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/forms/${formId}/entries`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params["paging[current_page]"] = ++page;
        const data = await fn({
          params,
          ...opts,
        });

        for (const d of data.entries) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.entries.length;

      } while (hasMore);
    },
  },
};
