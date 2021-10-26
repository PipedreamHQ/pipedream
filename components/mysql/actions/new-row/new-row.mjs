import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-new-row",
  name: "New Row",
  description: "Adds a new row. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/insert.html)",
  type: "action",
  version: "0.0.1",
  methods: {
    async insertRow({
      table, columns = [], values = [],
    }) {
      if (columns.length !== values.length) {
        throw new Error("The number of columns doesn't match the number of values");
      }

      const placehorder = values.map(() => "?").join(",");
      const options = {
        sql: `
          INSERT INTO \`${table}\` (${columns.join(",")})
            VALUES (${placehorder})
        `,
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
    columns: {
      type: "string[]",
      description: "Select the columns you want to use to insert the values",
      propDefinition: [
        mysql,
        "column",
        ({ table }) => ({
          table,
        }),
      ],
    },
    values: {
      description: "Set the values you want to insert on each column selected",
      propDefinition: [
        mysql,
        "whereValues",
      ],
    },
  },
  async run() {
    return await this.insertRow({
      table: this.table,
      columns: this.columns,
      values: this.values,
    });
  },
};
