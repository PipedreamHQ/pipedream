import common from "../common-watch-for-resource-changes.mjs";

export default {
  ...common,
  type: "source",
  key: "snowflake-change-to-warehouse",
  // eslint-disable-next-line
  name: "New, Updated, or Deleted Warehouse",
  description: "Emit new events when a warehouse is created, altered, or dropped",
  version: "0.0.2",
  props: {
    ...common.props,
    warehouses: {
      propDefinition: [
        common.props.snowflake,
        "warehouses",
      ],
      optional: true,
    },
    queryTypes: {
      type: "string[]",
      label: "Query Types",
      description: "**Optional**. The type of queries to watch for. If not provided, changes will be emitted for all query types.",
      options: [
        "CREATE",
        "ALTER",
        "DROP",
      ],
      default: [
        "CREATE",
        "ALTER",
        "DROP",
      ],
      optional: true,
    },
  },
  async run() {
    await this.watchObjectsAndEmitChanges("WAREHOUSE", this.warehouses, this.queryTypes);
  },
};
