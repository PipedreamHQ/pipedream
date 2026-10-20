import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-goal-alert-triggered-instant",
  name: "New Goal Alert Triggered (Instant)",
  description: "Emit new event when a goal alert rule fires (a goal reached, or fell under, its number of completions). [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    siteId: {
      propDefinition: [
        app,
        "siteId",
      ],
      optional: true,
      description: "Only emit events of this site. Leave it empty for every site.",
    },
    alertId: {
      propDefinition: [
        app,
        "alertId",
      ],
      optional: true,
      description: "Only emit events of this alert rule. Leave it empty for every rule.",
    },
  },
  methods: {
    ...common.methods,
    getEvent() {
      return "goal.completed_threshold";
    },
    getSummary(item) {
      return `Goal alert triggered: ${item.name}`;
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId)
        && (!this.alertId || item.alert_id === this.alertId);
    },
  },
  sampleEmit,
};
