import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "checkvist-new-list-item",
  name: "New List Item Added",
  description: "Emit new event when a new list item is added in a selected list.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    listId: {
      propDefinition: [
        common.props.checkvist,
        "listId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.checkvist.getListItems;
    },
    getArgs() {
      return {
        listId: this.listId,
      };
    },
    getSummary(item) {
      return `New Item: ${item.content}`;
    },
  },
  sampleEmit,
};
