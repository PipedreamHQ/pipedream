import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-delete-row",
  name: "Delete Row",
  description: "Delete an existing row. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/delete.html)",
  type: "action",
  version: "0.0.1",
  methods: {
    async deleteRows({
      table, condition, values = [],
    }) {
      const options = {
        sql: `DELETE FROM \`${table}\` WHERE ${condition}`,
        values,
      };
      return await this.mysql.executeQueryConnectionHandler(options);
    },
  },
  props: {
    mysql,
    table: {
      propDefinition: [
        mysql,
        "table",
      ],
    },
    condition: {
      propDefinition: [
        mysql,
        "whereCondition",
      ],
    },
    values: {
      propDefinition: [
        mysql,
        "whereValues",
      ],
    },
  },
  async run() {
    return await this.deleteRows({
      table: this.table,
      condition: this.condition,
      values: this.values,
    });
  },
};
