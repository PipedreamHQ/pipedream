import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "oracle_cloud_infrastructure-new-instance-state-change-instant",
  name: "New Instance State Change (Instant)",
  description: "Emit new event when a compute instance changes state (e.g., from stopped to running). This requires instance OCID and proper event rules set up in Oracle Cloud Infrastructure. [See the documentation](https://docs.oracle.com/en-us/iaas/api/#/en/events/20181201/Rule/CreateRule).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    instanceId: {
      propDefinition: [
        common.props.app,
        "instanceId",
        ({ compartmentId }) => ({
          compartmentId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getTopicName() {
      return `new-instance-state-change-${Date.now()}`;
    },
    // https://docs.oracle.com/en-us/iaas/Content/Events/Concepts/filterevents.htm
    getCondition() {
      return JSON.stringify({
        eventType: [
          events.COMPUTE.INSTANCE_ACTION_BEGIN,
          events.COMPUTE.INSTANCE_ACTION_END,
          events.COMPUTE.CHANGE_INSTANCE_COMPARTMENT_BEGIN,
          events.COMPUTE.CHANGE_INSTANCE_COMPARTMENT_END,
          events.COMPUTE.INSTANCE_FAILED,
          events.COMPUTE.LAUNCH_INSTANCE_BEGIN,
          events.COMPUTE.LAUNCH_INSTANCE_END,
          events.COMPUTE.LIVE_MIGRATE_BEGIN,
          events.COMPUTE.LIVE_MIGRATE_END,
          events.COMPUTE.INSTANCE_PREEMPTION_ACTION,
          events.COMPUTE.SCHEDULE_MAINTENANCE,
          events.COMPUTE.TERMINATE_INSTANCE_BEGIN,
          events.COMPUTE.TERMINATE_INSTANCE_END,
          events.COMPUTE.UPDATE_INSTANCE_BEGIN,
          events.COMPUTE.UPDATE_INSTANCE_END,
        ],
        data: {
          resourceId: this.instanceId,
        },
      });
    },
    generateMeta(resource) {
      return {
        id: resource.eventID,
        summary: `Instance state changed: ${resource.data?.resourceName}`,
        ts: Date.parse(resource.eventTime),
      };
    },
  },
};
