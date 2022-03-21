import devTo from "../../dev_to.app.js";
import moment from "moment";
import axios from "axios";

export default {
  name: "New Stories",
  type: "source",
  key: "dev_to-fresh-stories",
  description: "Emit event for each new story",
  version: "0.0.2",
  props: {
    db: "$.service.db",
    timer: {
      label: "Timer",
      description: "How often to poll for new posts",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
    devTo,
  },
  dedupe: "greatest",
  async run() {
    const url = "https://dev.to/api/articles?per_page=1000&top=1";
    const data = (await axios({
      method: "get",
      url,
      headers: {
        "api-key": `${this.devTo.$auth.api_key}`,
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
