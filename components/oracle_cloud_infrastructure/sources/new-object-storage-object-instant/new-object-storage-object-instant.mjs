import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "oracle_cloud_infrastructure-new-object-storage-object-instant",
  name: "New Object Storage Object (Instant)",
  description: "Emit new event when a new object is uploaded to a specified Oracle Cloud Infrastructure Object Storage bucket. [See the documentation](https://docs.oracle.com/en-us/iaas/api/#/en/events/20181201/Rule/CreateRule).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  hooks: {
    ...common.hooks,
    async deploy() {
      const {
        app,
        compartmentId,
        bucketName,
      } = this;

      const { value: namespaceName } = await app.getNamespace({
        compartmentId,
      });

      await app.updateBucket({
        namespaceName,
        bucketName,
        updateBucketDetails: {
          objectEventsEnabled: true,
        },
      });
    },
  },
  props: {
    ...common.props,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    info: {
      type: "alert",
      alertType: "info",
      content: "To emit events for object state changes, enable Emit Object Events on the bucket details page. [Learn more](https://docs.oracle.com/en-us/iaas/Content/Object/Tasks/managingbuckets_topic-To_enable_or_disable_emitting_events_for_object_state_changes.htm#top).",
    },
    bucketName: {
      propDefinition: [
        common.props.app,
        "bucketName",
        ({ compartmentId }) => ({
          compartmentId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getTopicName() {
      return `new-object-storage-${Date.now()}`;
    },
    // https://docs.oracle.com/en-us/iaas/Content/Events/Concepts/filterevents.htm
    getCondition() {
      return JSON.stringify({
        eventType: [
          events.OBJECT_STORAGE.CREATE_OBJECT,
        ],
        data: {
          additionalDetails: {
            bucketName: this.bucketName,
          },
        },
      });
    },
    generateMeta(resource) {
      return {
        id: resource.eventID,
        summary: `New Object: ${resource.data?.resourceName}`,
        ts: Date.parse(resource.eventTime),
      };
    },
  },
};
