import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "webinarfuel",
  propDefinitions: {
    webinarId: {
      type: "string",
      label: "Webinar ID",
      description: "The ID of the webinar",
      async options({ page }) {
        const { webinars } = await this.getWebinars({
          params: {
            page: page + 1,
          },
        });
        return webinars.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    webinarSessionId: {
      type: "string",
      label: "Session ID",
      description: "The webinar session id.",
      async options({ webinarId }) {
        const { webinar: { sessions } } = await this.getWebinar({
          webinarId,
        });
        return sessions.map(({
          id: value, formatted_scheduled_at: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description: "Session [TimeZone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Required if webinar timezone is `registrant`. Example: `America/New_York`.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the registrant",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the registrant",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "The tags to add to the registrant",
    },
  },
  methods: {
    exportSummary(step) {
      if (!step?.export) {
        throw new ConfigurationError("The summary method should be bind to the step object aka `$`");
      }
      return (msg = "") => step.export(constants.SUMMARY_LABEL, msg);
    },
    async makeRequest({
      step = this, path, headers, summary, ...args
    } = {}) {
      const config = {
        ...args,
        url: constants.BASE_URL + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      };

      const response = await axios(step, config);

      if (typeof summary === "function") {
        this.exportSummary(step)(summary(response));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        method: "post",
        ...args,
      });
    },
    getWebinars(args = {}) {
      return this.makeRequest({
        path: "/webinars",
        ...args,
      });
    },
    getWebinar({
      webinarId, ...args
    } = {}) {
      return this.makeRequest({
        path: `/webinars/${webinarId}`,
        ...args,
      });
    },
  },
};
