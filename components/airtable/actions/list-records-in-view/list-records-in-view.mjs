import common from "../common.mjs";
import commonList from "../common-list.mjs";

export default {
  key: "airtable-list-records-in-view",
  name: "List Records in View",
  description: "Retrieve records in a view with automatic pagination. Optionally sort and filter results.",
  type: "action",
  version: "0.1.1",
  ...commonList,
  props: {
    ...common.props,
    viewId: {
      type: "string",
      label: "View",
      withLabel: true,
      async options() {
        const baseId = this.baseId?.value ?? this.baseId;
        const tableId = this.tableId?.value ?? this.tableId;
        const tableSchema = await this.airtable.table(baseId, tableId);
        if (!tableSchema?.views) {
          return [];
        }
        return tableSchema.views.map((view) => ({
          label: view.name || view.id,
          value: view.id,
        }));
      },
    },
    ...commonList.props,
  },
};
