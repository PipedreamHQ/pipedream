import googleForms from "../../google_forms.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    googleForms,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        googleForms,
        "formId",
      ],
    },
  },
  methods: {
    generateMeta() {
      throw new Error("generateMeta not implemented.");
    },
    sortResponses(responses) {
      return responses.sort((a, b) => (
        new Date(b.lastSubmittedTime) - new Date(a.lastSubmittedTime)
      ));
    },
    setLastSubmittedTime(time) {
      if (!time) {
        return;
      }
      this.db.set("lastSubmittedTime", time);
    },
    getLastSubmittedTime() {
      return this.db.get("lastSubmittedTime");
    },
    emitResponses(responses) {
      for (const response of responses) {
        const meta = this.generateMeta(response);
        this.$emit(response, meta);
      }
    },
  },
};
