import app from "../../privatus_analytics.app.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "privatus_analytics-new-alert-triggered-instant",
  name: "New Alert Triggered (Instant)",
  description: "Emit new event when an alert rule fires: a traffic threshold, a spike or drop, a goal, a new referrer, no data, usage and more. [See the documentation](https://privatusanalytics.com/docs/api/webhooks)",
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
      return "alert.triggered";
    },
    getSummary(item) {
      return `Alert triggered: ${item.name}`;
    },
    isRelevant(item) {
      return (!this.siteId || (item.site_id || item.check?.site_id) === this.siteId)
        && (!this.alertId || item.alert_id === this.alertId);
    },
  },
  sampleEmit,
};
