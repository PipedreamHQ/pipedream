import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wufoo",
  propDefinitions: {
    formHash: {
      type: "string",
      label: "Form Hash",
      description: "The hash of the form to retrieve the entries.",
      async options({ page }) {
        const { Forms: data } = await this.listForms({
          params: {
            page,
          },
        });

        return data.map(({
          Hash: value, Name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return `https://${this.$auth.subdomain}.wufoo.com/api/v3`;
    },
    _getAuth() {
      return {
        username: this.$auth.api_key,
        password: "",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        auth: this._getAuth(),
        ...opts,
      };

      return axios($, config);
    },
    listFields(formHash) {
      return this._makeRequest({
        path: `forms/${formHash}/fields.json`,
      });
    },
    listForms() {
      return this._makeRequest({
        path: "forms.json",
      });
    },
    listFormEntries({
      formHash, ...args
    }) {
      return this._makeRequest({
        path: `forms/${formHash}/entries.json`,
        ...args,
      });
    },
    submitFormEntry({
      formHash, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `forms/${formHash}/entries.json`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = page++;
        const { Entries: data } = await fn({
          params,
          ...args,
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
