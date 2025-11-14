import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "booking_experts-inventory-object-updated",
  name: "Inventory Object Updated",
  description: "Emit new event when an inventory object is updated. [See the documentation](https://developers.bookingexperts.com/reference/administration-inventoryobjects-index)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    administrationId: {
      propDefinition: [
        common.props.bookingExperts,
        "administrationId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.bookingExperts.listInventoryObjects;
    },
    getArgs() {
      return {
        administrationId: this.administrationId,
        params: {
          sort: "-updated_at",
        },
      };
    },
    getTsField() {
      return "updated_at";
    },
    generateMeta(inventoryObject) {
      return {
        id: inventoryObject.id,
        summary: `Inventory object updated: ${inventoryObject.id}`,
        ts: Date.parse(inventoryObject.attributes.updated_at),
      };
    },
  },
};
