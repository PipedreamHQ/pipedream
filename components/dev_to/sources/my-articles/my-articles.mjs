import devTo from "../../dev_to.app.mjs";
import moment from "moment";
import common from "../common.mjs";

export default {
  name: "New my article",
  key: "dev_to-my-articles",
  description: "Emit new event for each new article published on your Dev.to account",
  type: "source",
  version: "0.0.4",
  props: {
    ...common.props,
    devTo,
  },
  dedupe: "greatest",
  async run({ $ }) {
    const data = await this.devTo.getMyArticles($, {
      params: {
        per_page: 1000,
        top: 1,
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
