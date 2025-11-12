import devTo from "../../dev_to.app.mjs";
import moment from "moment";
import common from "../common.mjs";

export default {
  name: "New Stories for a Tag",
  type: "source",
  description: "Emit new event for each new story that has a matching tag (e.g., javascript)",
  key: "dev_to-fresh-stories-by-tag",
  version: "0.0.4",
  props: {
    ...common.props,
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
  async run({ $ }) {
    const data = await this.devTo.getArticles($, {
      params: {
        per_page: 1000,
        top: 1,
        tag: encodeURIComponent(this.tag),
      },
    });

    data.forEach((event) => {
      this.$emit(event, {
        id: event.id,
        ts: moment(event.published_timestamp).valueOf(),
        summary: event.title,
      });
    });
  },
};
