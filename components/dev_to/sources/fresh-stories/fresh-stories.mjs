import devTo from "../../dev_to.app.mjs";
import moment from "moment";
import common from "../common.mjs";

export default {
  name: "New Stories",
  type: "source",
  key: "dev_to-fresh-stories",
  description: "Emit new Dev.to story",
  version: "0.0.5",
  props: {
    ...common.props,
    devTo,
  },
  dedupe: "greatest",
  async run({ $ }) {
    const data = await this.devTo.getArticles($, {
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
