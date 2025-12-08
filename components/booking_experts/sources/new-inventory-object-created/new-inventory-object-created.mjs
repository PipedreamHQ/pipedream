import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "booking_experts-new-inventory-object-created",
  name: "New Inventory Object Created",
  description: "Emit new event when a new inventory object is created. [See the documentation](https://developers.bookingexperts.com/reference/administration-inventoryobjects-index)",
  version: "0.0.5",
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
          sort: "-created_at",
        },
      };
    },
    generateMeta(inventoryObject) {
      return {
        id: inventoryObject.id,
        summary: `New inventory object created: ${inventoryObject.id}`,
        ts: Date.parse(inventoryObject.attributes.created_at),
      };
    },
  },
};
