import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "expofp",
  propDefinitions: {
    eventId: {
      label: "Event ID",
      type: "string",
      description: "The event ID",
      async options() {
        const events = await this.getEvents();

        return events.map((event) => ({
          label: event.name,
          value: event.id,
        }));
      },
    },
    exhibitorId: {
      label: "Exhibitor ID",
      type: "string",
      description: "The exhibitor ID",
      async options({ eventId }) {
        const exhibitors = await this.getExhibitors({
          data: {
            eventId,
          },
        });

        return exhibitors.map((event) => ({
          label: event.name,
          value: event.id,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _apiUrl() {
      return "https://app.expofp.com/api/v1";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        data: {
          ...args.data,
          token: this._apiToken(),
        },
      });
    },
    async getEvents() {
      return this._makeRequest({
        path: "/list-events",
        method: "post",
      });
    },
    async getExhibitors(args) {
      return this._makeRequest({
        path: "/list-exhibitors",
        method: "post",
        ...args,
      });
    },
  },
};
