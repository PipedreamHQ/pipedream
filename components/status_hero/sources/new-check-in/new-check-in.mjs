import app from "../../status_hero.app.mjs";
import common from "../common.mjs";

export default {
  key: "status_hero-new-check-in",
  name: "New Check In Event",
  description: "Emit new events when new status update (check-in) occurs. [See the docs here](https://api.statushero.com/#statuses)",
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
      return this.app.getStatuses;
    },
    getSummary(item) {
      return `${item.title} (${item.report_date})`;
    },
    getResourceKey() {
      return "statuses";
    },
    compareFn(item) {
      return new Date(item.completed_at).getTime() > this.getLastFetchTime();
    },
    getDateKey() {
      return "completed_at";
    },
  },
};
