import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cronfree",
  propDefinitions: {
    wdays: {
      type: "string[]",
      label: "Weekdays",
      description: "The days of the week to trigger the event (0-6 for Sunday-Saturday, -1 for any day)",
      default: [
        "-1",
      ],
    },
    months: {
      type: "string[]",
      label: "Months",
      description: "The months to trigger the event (1-12, -1 for any month)",
      default: [
        "-1",
      ],
    },
    mdays: {
      type: "string[]",
      label: "Month Days",
      description: "The days of the month to trigger the event (1-31, -1 for any day)",
      default: [
        "-1",
      ],
    },
    hours: {
      type: "string[]",
      label: "Hours",
      description: "The hours to trigger the event (0-23, -1 for any hour)",
      default: [
        "-1",
      ],
    },
    minutes: {
      type: "string[]",
      label: "Minutes",
      description: "The minutes to trigger the event (0-59, -1 for any minute)",
      default: [
        "-1",
      ],
    },
    timezone: {
      type: "string",
      label: "Timezone",
      description: "The timezone to trigger the event",
      default: "Africa/Abidjan",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://login.cronfree.com/zapier/schedule";
    },
    async scheduleEvent(opts = {}) {
      const {
        $ = this,
        wdays = this.wdays,
        months = this.months,
        mdays = this.mdays,
        hours = this.hours,
        minutes = this.minutes,
        timezone = this.timezone,
        hookUrl,
        licenseKey = this.$auth.api_key,
      } = opts;

      return axios($, {
        method: "POST",
        url: this._baseUrl(),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${licenseKey}`,
        },
        data: {
          hookUrl,
          wdays,
          months,
          mdays,
          hours,
          minutes,
          timezone,
        },
      });
    },
  },
  version: "0.0.{{ts}}",
};
