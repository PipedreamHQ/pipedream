import { v4 as uuidv4 } from "uuid";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "azure_sql-new-column",
  name: "New Column",
  description: "Triggers when a new column is added to a table.",
  type: "source",
  version: "0.0.7",
  dedupe: "unique",
  props: {
    ...common.props,
    table: {
      propDefinition: [
        common.props.app,
        "table",
      ],
    },
  },
  methods: {
    ...common.methods,
    getCurrentColumns() {
      return this.db.get("currentColumns") || [];
    },
    setCurrentColumns(columns) {
      this.db.set("currentColumns", columns);
    },
    generateMeta(resource) {
      return {
        id: uuidv4(),
        summary: `New Column Added: ${resource.COLUMN_NAME}`,
        ts: Date.now(),
      };
    },
    async listResults() {
      const {
        app,
        table,
        getCurrentColumns,
      } = this;

      const columns = getCurrentColumns();
      const { recordset } = await app.listNewColumns({
        table,
        columns,
      });

      const newColumns = recordset.map(({ COLUMN_NAME: column }) => column);

      this.processResources(recordset);
      this.setCurrentColumns(newColumns.concat(columns));
    },
  },
};
