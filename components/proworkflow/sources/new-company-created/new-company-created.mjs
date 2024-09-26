import common from "../common/webhook.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  name: "New Company Created",
  key: "proworkflow-new-company-created",
  description:
    "Emit new event when a new comapny is created. [See the docs](https://api.proworkflow.net/?documentation#introductionoverview).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventName() {
      return constants.EVENT_NAME.NEWCOMPANY;
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New Company: ${event.company.id}`,
        ts: Date.parse(event.company.lastmodified),
      };
    },
  },
};
