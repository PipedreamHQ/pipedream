import commonApp from "../airtable_oauth/common-app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...commonApp,
  type: "app",
  app: "airtable",
  propDefinitions: {
    ...commonApp.propDefinitions,
    baseId: {
      type: "string",
      label: "Base",
      description: "The base ID",
      async options() {
        // Uses special .bases method on airtable app prop
        const bases = await this.bases();
        return (bases ?? []).map((base) => ({
          label: base.name || base.id,
          value: base.id,
        }));
      },
    },
    tableId: {
      type: "string",
      label: "Table",
      description: "The table ID. If referencing a **Base** dynamically using data from another step (e.g., `{{steps.trigger.event.metadata.baseId}}`), you will not be able to select from the list of Tables, and automatic table options will not work when configuring this step. Please enter a custom expression to specify the **Table**.",
      async options({ baseId }) {
        // Uses special .tables method on airtable app prop
        let tables;
        try {
          tables = await this.tables(baseId?.value ?? baseId);
        } catch (err) {
          throw new ConfigurationError(`Could not find tables for base ID "${baseId}"`);
        }
        return (tables ?? []).map((table) => ({
          label: table.name || table.id,
          value: table.id,
        }));
      },
    },
    viewId: {
      type: "string",
      label: "View",
      description: "The view ID. If referencing a **Table** dynamically using data from another step (e.g., `{{steps.trigger.event.metadata.tableId}}`), you will not be able to select from the list of Views for this step. Please enter a custom expression to specify the **View**.",
      async options({
        baseId, tableId,
      }) {
        let tableSchema;
        try {
          // Uses special .table method on airtable app prop
          tableSchema = await this.table(
            baseId?.value ?? baseId,
            tableId?.value ?? tableId,
          );
        } catch (err) {
          throw new ConfigurationError(`Could not find views for table ID "${tableId}"`);
        }
        return (tableSchema?.views ?? []).map((view) => ({
          label: view.name || view.id,
          value: view.id,
        }));
      },
    },
    sortFieldId: {
      type: "string",
      label: "Sort: Field",
      description: "Optionally select a field to sort results. To sort by multiple fields, use the **Filter by Forumla** field. If referencing a **Table** dynamically using data from another step (e.g., `{{steps.mydata.$return_value}}`), automatic field options won't work when configuring this step. Please enter a custom expression to specify the **Sort: Field**.",
      optional: true,
      async options({
        baseId, tableId,
      }) {
        let tableSchema;
        try {
          // Uses special .table method on airtable app prop
          tableSchema = await this.table(
            baseId?.value ?? baseId,
            tableId?.value ?? tableId,
          );
        } catch (err) {
          throw new ConfigurationError(`Could not find fields for table ID "${tableId}"`);
        }
        return (tableSchema?.fields ?? []).map((field) => ({
          label: field.name || field.id,
          value: field.id,
        }));
      },
    },
  },
};
