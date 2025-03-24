import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "everhour-new-task-instant",
  name: "New Task Created (Instant)",
  description: "Emit new event when a task is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    projectId: {
      propDefinition: [
        common.props.everhour,
        "projectId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        project: this.projectId,
      };
    },
    getEventType() {
      return [
        "api:task:created",
      ];
    },
    getSummary(body) {
      return `New Task Created: ${body.payload.data.id}`;
    },
  },
  sampleEmit,
};
