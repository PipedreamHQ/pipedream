import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "screendesk",
  propDefinitions: {
    uuid: {
      type: "string",
      label: "UUID",
      description: "The unique id of the recording.",
      async options({ page }) {
        const { pagination } = await this.listRecordings({
          params: {
            page: page + 1,
          },
        });

        return pagination.records.map(({
          uuid, description, customer_email, user_email,
        }) => ({
          label: description || customer_email || user_email || uuid,
          value: uuid,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://app.screendesk.io/api/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    getRecording({
      uuid, ...args
    }) {
      return this._makeRequest({
        path: `recordings/${uuid}`,
        ...args,
      });
    },
    listRecordings(args = {}) {
      return this._makeRequest({
        path: "recordings",
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.page = ++page;
        const {
          pagination: {
            records: data,
            page: currentPage,
            last_page,
          },
        } = await fn({
          params,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = !(currentPage == last_page);

      } while (hasMore);
    },
  },
};
