const dev_to = require("../../dev_to.app.js");
const moment = require("moment");
const axios = require("axios");

module.exports = {
  name: "My articles",
  key: "dev_to-my-articles",
  description: "Emit an event for each new article published on your Dev.to account",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    dev_to,
  },
  dedupe: "greatest",
  async run(event) {
    const url = "https://dev.to/api/articles/me/published?per_page=1000&top=1";
    const data = (await axios({
      method: "get",
      url,
      headers: {
        "api-key": `${this.dev_to.$auth.api_key}`,
      },
    })).data;

    data.forEach((event) => {
      this.$emit(event, {
        id: event.id,
        ts: moment(event.published_timestamp).valueOf(),
        summary: event.title,
      });
    });
  },
};
