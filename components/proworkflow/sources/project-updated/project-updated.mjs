import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "proworkflow-project-updated",
  name: "Project Updated",
  description: "Emit new event when a project is updated. [See the docs](https://api.proworkflow.net/?documentation#gettingstartedgetfields).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return constants.EVENT_NAME.EDITPROJECT;
    },
    generateMeta(event) {
      const ts = Date.parse(event.project.lastmodified);
      return {
        id: `${event.id}-${ts}`,
        summary: `Project Updated: ${event.project.id}`,
        ts,
      };
    },
  },
};
