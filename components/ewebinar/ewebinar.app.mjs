import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ewebinar",
  propDefinitions: {
    webinarId: {
      type: "string",
      label: "Webinar ID",
      description: "ID of the webinar to register for",
      async options({ prevContext }) {
        const {
          webinars, nextCursor,
        } = await this.listWebinars({
          params: {
            nextCursor: prevContext.nextCursor,
          },
        });

        return {
          options: webinars.map(({
            id: value, title: label,
          }) => ({
            label,
            value,
          })),
          context: {
            nextCursor,
          },
        };
      },
    },
    sessions: {
      type: "string",
      label: "Session",
      description: "The webinar session",
      async options({ webinarId }) {
        const { sessions } = await this.listSessions({
          webinarId,
        });

        return sessions.map(({ text }) => text);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ewebinar.com/v2";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    listRegistrantSessions(opts = {}) {
      return this._makeRequest({
        path: "/registrants",
        ...opts,
      });
    },
    listSessions({ webinarId }) {
      return this._makeRequest({
        path: `/webinars/${webinarId}/sessions`,
      });
    },
    listWebinars(opts = {}) {
      return this._makeRequest({
        path: "/webinars",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let nextPage = false;
      let count = 0;

      do {
        if (nextPage) params.nextCursor = nextPage;
        const {
          registrants: data,
          nextCursor,
        } = await fn({
          params,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        nextPage = nextCursor;

      } while (nextPage);
    },
  },
};
