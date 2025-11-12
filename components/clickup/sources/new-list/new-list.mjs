import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "clickup-new-list",
  name: "New List (Instant)",
  description: "Emit new event when a new list is created",
  version: "0.0.11",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    _getMeta({ list_id: listId }) {
      return {
        id: listId,
        summary: String(listId),
        ts: Date.now(),
      };
    },
    _getEventsList() {
      return [
        "listCreated",
      ];
    },
  },
  async run(httpRequest) {
    console.log("Event received");
    this.checkSignature(httpRequest);
    this.$emit(httpRequest.body, this._getMeta(httpRequest.body));
  },
  sampleEmit,
};
