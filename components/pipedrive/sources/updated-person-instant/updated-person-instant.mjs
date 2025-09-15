import { parseData } from "../../common/utils.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "pipedrive-updated-person-instant",
  name: "Person Updated (Instant)",
  description: "Emit new event when a person is updated.",
  version: "0.1.5",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getExtraData() {
      return {
        event_action: "change",
        event_object: "person",
      };
    },
    getSummary(body) {
      return `Person successfully updated: ${body.data.id}`;
    },
    async parseData(body) {
      return await parseData({
        fn: this.pipedrive.getPersonCustomFields,
        body,
      });
    },
  },
  sampleEmit,
};
