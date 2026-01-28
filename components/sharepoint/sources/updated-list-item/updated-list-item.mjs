import common from "../common/common.mjs";

export default {
  ...common,
  key: "sharepoint-updated-list-item",
  name: "Updated List Item",
  description: "Emit new event when a list item is updated in Microsoft Sharepoint.",
  version: "0.0.8",
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
      return "lastModifiedDateTime";
    },
    generateMeta(item) {
      const ts = Date.parse(item.lastModifiedDateTime);
      return {
        id: `${item.id.slice(-51)}${ts}`,
        summary: `Updated Item ${item.id}`,
        ts,
      };
    },
  },
};
