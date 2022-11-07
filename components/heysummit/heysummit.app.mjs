import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "heysummit",
  propDefinitions: {
    eventId: {
      label: "Event ID",
      description: "The event ID",
      type: "integer",
      async options({ prevContext }) {
        const options = {};

        if (prevContext.nextPage) {
          options.url = prevContext.nextPage;
        }

        const {
          next, results,
        } = await this.getEvents(options);

        return {
          options: results.map((event) => ({
            label: event.title,
            value: event.id,
          })),
          context: {
            nextPageToken: next,
          },
        };
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://api.heysummit.com/api";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Token ${this._apiToken()}`,
        },
        ...args,
      });
    },
    async getEvents({ ...args }) {
      return this._makeRequest({
        path: "/events",
        ...args,
      });
    },
    async getTickets({ ...args }) {
      return this._makeRequest({
        path: "/tickets",
        ...args,
      });
    },
    async getAttendees({ ...args }) {
      return this._makeRequest({
        path: "/attendees",
        ...args,
      });
    },
  },
};
