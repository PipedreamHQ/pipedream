const npm = require("../../npm.app.js");
const { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } = require("@pipedream/platform");
const axios = require("axios");

module.exports = {
  key: "npm-download-counts",
  name: "npm Download Counts",
  description: "Emit an event with the latest count of downloads for an npm package",
  version: "0.0.2",
  type: "source",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    period: {
      type: "string",
      label: "Period",
      description: "Select last-day, last-week or last-month.",
      optional: false,
      default: "last-day",
      options: [
        "last-day",
        "last-week",
        "last-month",
      ],
    },
    package: {
      type: "string",
      label: "Package",
      description: "Enter an npm package name. Leave blank for all",
      optional: true,
      default: "@pipedreamhq/platform",
    },
    npm,
  },
  async run() {
    const npm_event = (await axios({
      method: "get",
      url: `https://api.npmjs.org/downloads/point/${encodeURIComponent(this.period)}/${encodeURIComponent(this.package)}`,
    })).data;
    this.$emit(npm_event, {
      summary: "" + npm_event.downloads,
    });
  },
};
