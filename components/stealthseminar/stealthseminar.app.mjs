import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "stealthseminar",
  propDefinitions: {
    shortId: {
      type: "string",
      label: "Short ID",
      description: "The short ID of a webinar. To find your short ID, go to My Webinars, then find your event and click on copy to clipboard for either Registration Page or Webinar Watch Page. The shortId is the last 6 characters of the copied URL.",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the event for which the user is registering, in ISO 8601 format",
      async options({ shortId }) {
        const { upcoming_times: times } = await this.getRegistrationInformation({
          shortId,
        });
        return times;
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.joinnow.live/webinars";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        debug: true,
        ...opts,
      });
    },
    getRegistrationInformation({
      shortId, ...opts
    }) {
      return this._makeRequest({
        path: `/${shortId}/registration-information`,
        ...opts,
      });
    },
    registerForWebinar({
      shortId, ...opts
    }) {
      return this._makeRequest({
        path: `/${shortId}/registration`,
        method: "post",
        ...opts,
      });
    },
  },
};
