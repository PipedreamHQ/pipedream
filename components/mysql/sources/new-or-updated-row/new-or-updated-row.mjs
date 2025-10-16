import common from "../common/table.mjs";
import { v4 as uuidv4 } from "uuid";

const { mysql } = common.props;

export default {
  ...common,
  key: "mysql-new-or-updated-row",
  name: "New or Updated Row",
  description:
    "Emit new event when you add or modify a new row in a table. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  type: "source",
  version: "2.0.6",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    column: {
      propDefinition: [
        mysql,
        "column",
        (c) => ({
          table: c.table,
        }),
      ],
      label: "Order By",
      description:
        "A datetime column, such as 'date_updated' or 'last_modified' that is set to the current datetime when a row is updated.",
    },
  },
  hooks: {
    async deploy() {
      await this.listTopRows(this.column);
    },
  },
  methods: {
    ...common.methods,
    async listResults() {
      await this.listRowResults(this.column);
    },
    generateMeta(row) {
      return {
        id: uuidv4(),
        summary: `New Row Added/Updated ${row[this.column]}`,
        ts: Date.now(),
      };
    },
  },
};
