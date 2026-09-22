import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "cheddar-new-promotion-created",
  name: "New Promotion Created",
  description: "Emit new event when a new promotion is created. [See the documentation](https://docs.getcheddar.com/#promotions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    info: {
      type: "alert",
      alertType: "info",
      content: "Note: Product must containt at least one promotion to create source",
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.cheddar.listPromotions;
    },
    getResourceType() {
      return "promotion";
    },
    generateMeta(promotion) {
      return {
        id: promotion["@_id"],
        summary: `New Promotion with ID ${promotion["@_id"]}`,
        ts: Date.parse(promotion.createdDatetime),
      };
    },
  },
};
