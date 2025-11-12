import devTo from "../../dev_to.app.mjs";
import moment from "moment";
import common from "../common.mjs";

export default {
  name: "New reading list item",
  key: "dev_to-new-reading-list-item",
  description:
    "Emit new event for each new reading list item on your Dev.to account",
  type: "source",
  version: "0.0.4",
  props: {
    ...common.props,
    devTo,
  },
  dedupe: "greatest",
  async run({ $ }) {
    const data = await this.devTo.getReadingList($, {
      params: {
        per_page: 100,
      },
    });

    data.forEach((event) => {
      this.$emit(event, {
        id: event.id,
        ts: moment(event.created_at).valueOf(),
        summary: event.article.title,
      });
    });
  },
};
