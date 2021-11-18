import common from "../common/table.mjs";

const { mysql } = common.props;

export default {
  ...common,
  key: "mysql-new-or-updated-row",
  name: "New or Updated Row",
  description: "Emit new event when you add or modify a new row in a table. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  type: "source",
  version: "0.0.2",
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
      /**
       * Workaround to fix the following issue
       * https://github.com/PipedreamHQ/pipedream/issues/1842
       */
      const {
        // eslint-disable-next-line no-unused-vars
        id,
        ...otherProperties
      } = row;

      return {
        id: JSON.stringify(otherProperties),
        summary: `New Row Added/Updated ${row[this.column]}`,
        ts: Date.now(),
      };
    },
  },
};
