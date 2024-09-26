import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sympla",
  propDefinitions: {
    eventId: {
      type: "string",
      label: "Event",
      description: "Event to be emitted.",
      async options({ page }) {
        const res = await this.listEvents(page + 1);
        return res.data.map((event) => ({
          value: event.id,
          label: event.name,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.sympla.com.br/public";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "s_token": this.$auth.token,
      };
    },
    _getAxiosParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async listEvents(page, from, published) {
      const res = await axios(this, this._getAxiosParams({
        method: "GET",
        path: "/v3/events",
        params: {
          page,
          from,
          published,
        },
      }));
      return res;
    },
    async listAttendees(eventId, page) {
      const res = await axios(this, this._getAxiosParams({
        method: "GET",
        path: `/v3/events/${eventId}/participants`,
        params: {
          page,
        },
      }));
      return res;
    },
    async listOrders(eventId, page) {
      const res = await axios(this, this._getAxiosParams({
        method: "GET",
        path: `/v3/events/${eventId}/orders`,
        params: {
          page,
        },
      }));
      return res;
    },
  },
};
