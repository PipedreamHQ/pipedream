import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "proworkflow-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedgetfields).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return constants.EVENT_NAME.NEWPROJECT;
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New Project: ${event.project.id}`,
        ts: Date.parse(event.project.lastmodified),
      };
    },
  },
};
