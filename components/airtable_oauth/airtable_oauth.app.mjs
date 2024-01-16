import commonApp from "../airtable/common-app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { fieldTypeToPropType } from "../airtable/common/utils.mjs";

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
        const options = (bases ?? []).map((base) => ({
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
      async options({
        baseId, tableId,
      }) {
        let views;
        try {
          const { tables } = await this.listTables({
            baseId,
          });
          const table = tables.find(({ id }) => id === tableId);
          views = table.views;
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
    fieldName: {
      type: "string",
      label: "Search Field",
      description: "The field to match against the search value",
      async options({
        baseId, tableId, fieldType,
      }) {
        let fields;
        try {
          const { tables } = await this.listTables({
            baseId,
          });
          const table = tables.find(({ id }) => id === tableId);
          fields = table.fields;
          if (fieldType) {
            fields = fields.filter(({ type }) => fieldTypeToPropType(type) === fieldType);
          }
        } catch (err) {
          throw new ConfigurationError(`Could not find fields for table ID "${tableId}"`);
        }
        return (fields ?? []).map((field) => field.name);
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Identifier of a record",
      async options({
        baseId, tableId, prevContext,
      }) {
        const params = {};
        if (prevContext?.newOffset) {
          params.offset = prevContext.newOffset;
        }
        const {
          records, offset,
        } = await this.listRecords({
          baseId,
          tableId,
          params,
        });
        const options = (records ?? []).map((record) => ({
          label: record.fields?.Name || record.id,
          value: record.id,
        }));
        return {
          options,
          context: {
            newOffset: offset,
          },
        };
      },
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "Identifier of a comment",
      async options({
        baseId, tableId, recordId, prevContext,
      }) {
        const params = {};
        if (prevContext?.newOffset) {
          params.offset = prevContext.newOffset;
        }
        const {
          comments, offset,
        } = await this.listComments({
          baseId,
          tableId,
          recordId,
          params,
        });
        const options = (comments ?? []).map((comment) => ({
          label: comment.text,
          value: comment.id,
        }));
        return {
          options,
          context: {
            newOffset: offset,
          },
        };
      },
    },
    returnFieldsByFieldId: {
      type: "boolean",
      label: "Return Fields By Field ID",
      description: "An optional boolean value that lets you return field objects where the key is the field id. This defaults to `false`, which returns field objects where the key is the field name.",
      optional: true,
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
    listRecords({
      baseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}`,
        ...args,
      });
    },
    listComments({
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}/comments`,
        ...args,
      });
    },
    createRecord({
      baseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}`,
        method: "POST",
        ...args,
      });
    },
    createTable({
      baseId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables`,
        method: "POST",
        ...args,
      });
    },
    createField({
      baseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables/${tableId}/fields`,
        method: "POST",
        ...args,
      });
    },
    createComment({
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}/comments`,
        method: "POST",
        ...args,
      });
    },
    updateRecord({
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}`,
        method: "PATCH",
        ...args,
      });
    },
    updateTable({
      baseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables/${tableId}`,
        method: "PATCH",
        ...args,
      });
    },
    updateField({
      baseId, tableId, fieldId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables/${tableId}/fields/${fieldId}`,
        method: "PATCH",
        ...args,
      });
    },
    updateComment({
      baseId, tableId, recordId, commentId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}/comments/${commentId}`,
        method: "PATCH",
        ...args,
      });
    },
    deleteRecord({
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
