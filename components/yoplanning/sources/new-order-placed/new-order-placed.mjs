import common from "../common/polling.mjs";

export default {
  ...common,
  key: "yoplanning-new-order-placed",
  name: "New Order Placed",
  description: "Triggers when a new order is placed. [See the documentation](https://yoplanning.pro/api/v3.1/swagger/)",
  type: "source",
  version: "0.0.3",
  dedupe: "unique",
  props: {
    ...common.props,
    teamId: {
      propDefinition: [
        common.props.app,
        "teamId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.app.listOrders;
    },
    getResourceFnArgs() {
      return {
        teamId: this.teamId,
        params: {
          ordering: "-creation_date",
          creation_date__gt: this.getLastCreationDate(),
        },
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Order: ${resource.id}`,
        ts: Date.parse(resource.creation_date),
      };
    },
  },
};
