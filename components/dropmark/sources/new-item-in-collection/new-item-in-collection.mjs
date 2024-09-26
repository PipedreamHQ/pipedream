import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  type: "source",
  key: "dropmark-new-item-in-collection",
  name: "New Item in Collection",
  description: "Emit new event when a new item is added to a collection in Dropmark. [See the documentation](https://support.dropmark.com/article/96-api)",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    collectionId: {
      propDefinition: [
        common.props.dropmark,
        "collectionId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.dropmark.getCollectionItems;
    },
    getArgs() {
      return {
        collectionId: this.collectionId,
      };
    },
    getResourceType() {
      return "items";
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New item ${item.name}`,
        ts: Date.parse(item.created_at),
      };
    },
  },
  sampleEmit,
};
