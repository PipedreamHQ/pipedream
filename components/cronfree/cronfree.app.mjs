import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
import timezones from "./common/timezones.mjs";

export default {
  type: "app",
  app: "cronfree",
  propDefinitions: {
    wdays: {
      type: "string[]",
      label: "Weekdays",
      description: "The days of the week to trigger the event (`0-6` for Sunday-Saturday, `-1` for any day)",
      options: constants.WEEKDAYS,
    },
    months: {
      type: "string[]",
      label: "Months",
      description: "The months to trigger the event (`1-12`, `-1` for any month)",
      options: constants.MONTHS,
    },
    mdays: {
      type: "string[]",
      label: "Days",
      description: "The days of the month to trigger the event (`1-31`, `-1` for any day)",
      options: constants.DAYS,
    },
    hours: {
      type: "string[]",
      label: "Hours",
      description: "The hours to trigger the event (`0-23`, `-1` for any hour)",
      options: constants.HOURS,
    },
    minutes: {
      type: "string[]",
      label: "Minutes",
      description: "The minutes to trigger the event (`0-59`, `-1` for any minute)",
      options: constants.MINUTES,
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone to trigger the event",
      options: timezones,
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getAuthData(data) {
      return {
        ...data,
        license_key: this.$auth.license_key,
      };
    },
    makeRequest({
      $ = this, path, data, ...args
    }) {
      const config = {
        ...args,
        debug: true,
        url: this.getUrl(path),
        headers: {
          "Content-Type": "application/json",
        },
        data: this.getAuthData(data),
      };
      return axios($, config);
    },
    post(args = {}) {
      return this.makeRequest({
        method: "POST",
        ...args,
      });
    },
  },
};
