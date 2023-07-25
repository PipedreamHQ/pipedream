import commonApp from "../airtable/common-app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...commonApp,
  type: "app",
  app: "airtable_oauth",
  propDefinitions: {
    ...commonApp.propDefinitions,
    baseId: {
      type: "string",
      label: "Base",
      description: "The base ID",
      async options({ prevContext }) {
        const params = {};
        if (prevContext?.newOffset) {
          params.offset = prevContext.newOffset;
        }
        const {
          bases, offset,
        } = await this.listBases({
          params,
        });
        const options =  (bases ?? []).map((base) => ({
          label: base.name || base.id,
          value: base.id,
        }));
        return {
          options,
          context: {
            newOffset: offset,
          },
        };
      },
    },
    tableId: {
      type: "string",
      label: "Table",
      description: "The table ID. If referencing a **Base** dynamically using data from another step (e.g., `{{steps.trigger.event.metadata.baseId}}`), you will not be able to select from the list of Tables, and automatic table options will not work when configuring this step. Please enter a custom expression to specify the **Table**.",
      async options({ baseId }) {
        let tables;
        try {
          tables  = (await this.listTables({
            baseId,
          })).tables;
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
      async options({ baseId }) {
        let views;
        try {
          views = (await this.listViews({
            baseId,
          })).views;
        } catch (err) {
          throw new ConfigurationError(`Could not find views for base ID "${baseId}"`);
        }
        return (views ?? []).map((view) => ({
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
        let fields;
        try {
          const { tables } = await this.listTables({
            baseId,
          });
          const table = tables.find(({ id }) => id === tableId);
          fields = table.fields;
        } catch (err) {
          throw new ConfigurationError(`Could not find fields for table ID "${tableId}"`);
        }
        return (fields ?? []).map((field) => ({
          label: field.name || field.id,
          value: field.id,
        }));
      },
    },
  },
  methods: {
    ...commonApp.methods,
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    getRecord({
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}`,
        ...args,
      });
    },
    listBases(args = {}) {
      return this._makeRequest({
        path: "/meta/bases",
        ...args,
      });
    },
    listTables({
      baseId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables`,
        ...args,
      });
    },
    listViews({
      baseId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/views`,
        ...args,
      });
    },
  },
};
