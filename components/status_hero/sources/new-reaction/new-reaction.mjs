import app from "../../status_hero.app.mjs";
import common from "../common.mjs";

export default {
  key: "status_hero-new-reaction",
  name: "New Reaction Event",
  description: "Emit new events when new reaction for a status update (check-in) occurs. [See the docs here](https://api.statushero.com/#reactions)",
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
      return this.app.getReactions;
    },
    getSummary(item) {
      return `${item.title} (${item.body})`;
    },
    getResourceKey() {
      return "reactions";
    },
    compareFn(item) {
      return new Date(item.created_at).getTime() > this.getLastFetchTime();
    },
    getDateKey() {
      return "created_at";
    },
  },
};
