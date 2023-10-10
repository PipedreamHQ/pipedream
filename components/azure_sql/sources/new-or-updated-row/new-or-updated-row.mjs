import { v4 as uuidv4 } from "uuid";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "azure_sql-new-or-updated-row",
  name: "New or Updated Row",
  description: "Triggers when a new row is added or an existing row is updated.",
  type: "source",
  version: "0.0.1",
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
  },
};
