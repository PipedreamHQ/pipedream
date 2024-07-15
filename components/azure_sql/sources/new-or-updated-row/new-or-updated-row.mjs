import { v4 as uuidv4 } from "uuid";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "azure_sql-new-or-updated-row",
  name: "New or Updated Row",
  description: "Triggers when a new row is added or an existing row is updated.",
  type: "source",
  version: "0.0.4",
  dedupe: "unique",
  props: {
    ...common.props,
    table: {
      propDefinition: [
        common.props.app,
        "table",
      ],
    },
    column: {
      description: "The column is used to create a raw number for pagination.",
      propDefinition: [
        common.props.app,
        "column",
        ({ table }) => ({
          table,
        }),
      ],
    },
    timestampColumn: {
      propDefinition: [
        common.props.app,
        "column",
        ({ table }) => ({
          table,
        }),
      ],
      label: "Timestamp Column",
      description: "A datetime column, such as 'date_updated' or 'last_modified' that is set to the current datetime when a row is updated.",
    },
  },
  methods: {
    ...common.methods,
    getResourceName() {
      return "recordset";
    },
    getResourceFn() {
      return this.app.listResources;
    },
    getResourceFnArgs() {
      const {
        table,
        column,
      } = this;
      return {
        table,
        column,
      };
    },
    generateMeta() {
      return {
        id: uuidv4(),
        summary: "New Row Added/Updated",
        ts: Date.now(),
      };
    },
    processResources(resources) {
      const lastTs = this.getLastTs();
      let maxTs = lastTs;

      for (const resource of resources) {
        delete resource.pdId;
        const ts = Date.parse(resource[this.timestampColumn]);
        if (ts > lastTs) {
          this.$emit(resource, this.generateMeta(resource));
          if (ts > maxTs) {
            maxTs = ts;
          }
        }
      }

      this.setLastTs(maxTs);
    },
  },
};
