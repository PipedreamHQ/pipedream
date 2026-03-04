import common from "../common/common.mjs";

export default {
  ...common,
  key: "sharepoint-new-list-item",
  name: "New List Item",
  description: "Emit new event when a new list item is created in Microsoft Sharepoint.",
  version: "0.0.11",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    siteId: {
      propDefinition: [
        common.props.sharepoint,
        "siteId",
      ],
    },
    listId: {
      propDefinition: [
        common.props.sharepoint,
        "listId",
        (c) => ({
          siteId: c.siteId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.sharepoint.listItems;
    },
    getArgs() {
      return {
        siteId: this.siteId,
        listId: this.listId,
        params: {
          expand: "fields",
        },
      };
    },
    getTsField() {
      return "createdDateTime";
    },
    generateMeta(item) {
      return {
        id: item.id.slice(-64),
        summary: `New Item ${item.id}`,
        ts: Date.parse(item.createdDateTime),
      };
    },
  },
};
