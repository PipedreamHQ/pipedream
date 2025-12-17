import utils from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "frontapp-new-conversation-state-change",
  name: "New Conversation State Change",
  description: "Emit new event when a conversation reaches a specific state. [See the documentation](https://dev.frontapp.com/reference/list-events)",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    types: {
      type: "string[]",
      label: "States to Listen For",
      description: "Trigger a workflow when a conversation reaches any of these states. [See the documentation](https://dev.frontapp.com/reference/list-conversations) for more detail.",
      options: utils.TYPES_OPTIONS,
    },
  },
  methods: {
    ...common.methods,
    _getFunction() {
      return this.frontapp.listEvents;
    },
    _getParams(lastTs) {
      return {
        "q[after]": lastTs,
        "q[types]": this.types,
        "sort_by": "created_at",
        "sort_order": "desc",
      };
    },
    _getEmit(item) {
      return {
        id: item.id,
        summary: `New state of the conversation with id: "${item.id}" was changed!`,
        ts: Date.parse(item.emitted_at),
      };
    },
  },
  sampleEmit,
};
