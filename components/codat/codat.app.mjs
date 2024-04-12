import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "codat",
  propDefinitions: {
    eventType: {
      type: "string",
      label: "Event Type",
      description: "The type of event to emit when it is produced by Codat",
      required: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.codat.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getEvents(eventType) {
      return this._makeRequest({
        path: `/events/${eventType}`,
      });
    },
    async emitEvent(eventType) {
      const event = await this.getEvents(eventType);
      this.$emit(event, {
        summary: `New ${eventType} event`,
        id: event.id,
        ts: +new Date(),
      });
    },
  },
};
