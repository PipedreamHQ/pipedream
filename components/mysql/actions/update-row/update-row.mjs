import mysql from "../../mysql.app.mjs";

export default {
  key: "mysql-update-row",
  name: "Update Row",
  description: "Updates an existing row",
  type: "action",
  version: "0.0.1",
  methods: {
    async updateRow({
      table, condition, conditionValues = [], columnsToUpdate = [], valuesToUpdate = [],
    }) {
      if (!conditionValues.length) {
        throw new Error("Please provide some values to match the condition");
      }

      if (!valuesToUpdate.length) {
        throw new Error("Please provide some values to update");
      }

      if (columnsToUpdate.length !== valuesToUpdate.length) {
        throw new Error("The number of columns doesn't match with the number of values to update");
      }

      const updates =
        columnsToUpdate
          .map((column) => `SET \`${column}\` = ?`)
          .join(", ");

      const options = {
        sql: `
          UPDATE \`${table}\`
            ${updates}
            WHERE ${condition}`,
        values: [
          ...valuesToUpdate,
          ...conditionValues,
        ],
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
    conditionValues: {
      propDefinition: [
        mysql,
        "whereValues",
      ],
    },
    columnsToUpdate: {
      type: "string[]",
      description: "Select the columns you want to use to update the values",
      propDefinition: [
        mysql,
        "column",
        ({ table }) => ({
          table,
        }),
      ],
    },
    valuesToUpdate: {
      description: "Set the values you want to update on each column selected",
      propDefinition: [
        mysql,
        "whereValues",
      ],
    },
  },
  async run() {
    return await this.updateRow({
      table: this.table,
      condition: this.condition,
      conditionValues: this.conditionValues,
      columnsToUpdate: this.columnsToUpdate,
      valuesToUpdate: this.valuesToUpdate,
    });
  },
};
