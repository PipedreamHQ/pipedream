import app from "../../status_hero.app.mjs";
import common from "../common.mjs";

export default {
  key: "status_hero-new-comment",
  name: "New Comment Event",
  description: "Emit new events when new comments are created on statuses. [See the docs here](https://api.statushero.com/#comments)",
  version: "0.0.1",
  type: "source",
  ...common,
  props: {
    app,
    ...common.props,
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.getComments;
    },
    getSummary(item) {
      return `${item.title} (${item.body})`;
    },
    getResourceKey() {
      return "comments";
    },
    compareFn(item) {
      return new Date(item.created_at).getTime() > this.getLastFetchTime();
    },
    getDateKey() {
      return "created_at";
    },
  },
};
