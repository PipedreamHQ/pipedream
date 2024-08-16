import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "rentman-new-item-created",
  name: "New Item Created",
  description: "Emit new event when an item is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    itemType: {
      propDefinition: [
        common.props.rentman,
        "itemType",
      ],
    },
  },
  methods: {
    ...common.methods,
    getDateField() {
      return "created";
    },
    getFunction() {
      return this.rentman.listItems.bind(null, this.itemType);
    },
    getParams({ lastDate }) {
      return {
        "created[gt]": lastDate,
        "sort": "-created",
      };
    },
    getSummary(item) {
      return `New ${this.itemType} created: ${item.id}`;
    },
  },
  sampleEmit,
};
