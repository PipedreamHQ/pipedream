import devTo from "../../dev_to.app.mjs";
import moment from "moment";
import axios from "axios";

export default {
  name: "New Stories for a Tag",
  type: "source",
  description: "Emit new event for each new story that has a matching tag (e.g., javascript)",
  key: "dev_to-fresh-stories-by-tag",
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
    tag: {
      type: "string",
      label: "Tag",
      description: "Tags to watch",
      optional: true,
      default: "",
    },
    devTo,
  },
  dedupe: "greatest",
  async run() {
    const url = `https://dev.to/api/articles?per_page=1000&top=1&tag=${encodeURIComponent(this.tag)}`;
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
