import common from "../common-watch-for-resource-changes.mjs";

export default {
  ...common,
  props: {
    ...common.props,
    warehouses: {
      propDefinition: [
        common.props.snowflake,
        "warehouses",
      ],
      optional: true,
    },
  },
  type: "source",
  key: "snowflake-change-to-warehouse",
  // eslint-disable-next-line
  name: "New, Updated, or Deleted Warehouse",
  description: "Emit new events when a warehouse is created, altered, or dropped",
  version: "0.1.2",
  async run() {
    await this.watchObjectsAndEmitChanges("WAREHOUSE", this.warehouses, this.queryTypes);
  },
};
