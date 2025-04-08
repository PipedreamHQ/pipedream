import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "oracle_cloud_infrastructure-new-autonomous-database-created-instant",
  name: "New Autonomous Database Created (Instant)",
  description: "Emit new event when a new autonomous database is created in a specified compartment. [See the documentation](https://docs.oracle.com/en-us/iaas/api/#/en/events/20181201/Rule/CreateRule).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTopicName() {
      return `new-autonomous-database-created-${Date.now()}`;
    },
    // https://docs.oracle.com/en-us/iaas/Content/Events/Concepts/filterevents.htm
    getCondition() {
      return JSON.stringify({
        eventType: [
          events.DATABASE.AUTONOMOUS_DATABASE_CREATE_END,
        ],
      });
    },
    generateMeta(resource) {
      return {
        id: resource.eventID,
        summary: `New Autonomous Database: ${resource.data?.resourceName}`,
        ts: Date.parse(resource.eventTime),
      };
    },
  },
};
