import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "gem",
  propDefinitions: {
    createdBy: {
      type: "string",
      label: "Created By",
      description: "Who the candidate was created by",
      async options({ page }) {
        const data = await this.listUsers({
          params: {
            page: page + 1,
            page_size: LIMIT,
          },
        });

        return data.map(({
          id: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    projectIds: {
      type: "string[]",
      label: "Project IDs",
      description: "If `Project IDs` is provided with an array of project ids, the candidate will be added into the projects once they are created.",
      async options({ page }) {
        const data = await this.listProjects({
          params: {
            page: page + 1,
            page_size: LIMIT,
          },
        });

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gem.com/v0";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
        "content-type": "application/json",
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
    listCandidates(opts = {}) {
      return this._makeRequest({
        path: "/candidates",
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    createCandidate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/candidates",
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
        params.page = ++page;
        params.page_size = LIMIT;
        const data = await fn({
          params,
          ...opts,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length === LIMIT;

      } while (hasMore);
    },
  },
};
