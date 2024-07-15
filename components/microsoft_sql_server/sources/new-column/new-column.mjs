import { v4 as uuidv4 } from "uuid";
import common from "../common/polling.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  key: "microsoft_sql_server-new-column",
  name: "New Column",
  description: "Triggers when a new column is added to a table. [See the documentation](https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-columns-transact-sql?view=sql-server-ver16)",
  type: "source",
  version: "0.0.5",
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
      return this.db.get(constants.CURRENT_COLUMNS) || [];
    },
    setCurrentColumns(columns) {
      this.db.set(constants.CURRENT_COLUMNS, columns);
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
