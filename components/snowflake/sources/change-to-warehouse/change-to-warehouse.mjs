import common from "../common-watch-for-resource-changes.mjs";

export default {
  ...common,
  type: "source",
  key: "snowflake-change-to-warehouse",
  // eslint-disable-next-line
  name: "New, Updated, or Deleted Warehouse",
  description: "Emit new events when a warehouse is created, altered, or dropped",
  version: "0.0.1",
  async run() {
    await this.watchObjectsAndEmitChanges("WAREHOUSE", this.warehouses);
  },
};
