import common from "../common/webhook.mjs";
import events from "../common/events.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "userflow-new-flow-completed-instant",
  name: "New Flow Completed (Instant)",
  description: "Emit new event when a flow is completed by a user by reaching a goal step. [See the documentation](https://userflow.com/docs/api)",
  version: "0.0.1",
  type: "source",
  dedupe: "greatest",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listContent;
    },
    getResourcesFnArgs() {
      return {
        params: {
          limit: constants.DEFAULT_LIMIT,
          order_by: "-created_at",
          type: constants.CONTENT_TYPE.FLOW,
        },
      };
    },
    getResourcesName() {
      return "data";
    },
    getTopics() {
      const topic =
        events.TOPIC.EVENT_TRACKED_NAME
          .replace(events.NAME_PLACEHOLDER, events.EVENT.FLOW_COMPLETED);

      return [
        topic,
      ];
    },
    generateMeta(resource) {
      const ts = Date.parse(resource.created_at);
      return {
        id: ts,
        summary: `Flow Completed: ${resource.id}`,
        ts,
      };
    },
  },
  sampleEmit,
};
