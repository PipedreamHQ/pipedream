import { parseData } from "../../common/utils.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-updated-lead-instant",
  name: "Lead Updated (Instant)",
  description: "Emit new event when a lead is updated.",
  version: "0.1.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "change",
        event_object: "lead",
      };
    },
    getSummary(body) {
      return `Lead successfully updated: ${body.data.id}`;
    },
    async parseData(body) {
      return await parseData({
        fn: this.pipedrive.getDealCustomFields,
        body,
      });
    },
  },
  sampleEmit,
};
