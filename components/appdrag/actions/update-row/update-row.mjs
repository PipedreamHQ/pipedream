import app from "../../appdrag.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "appdrag-update-row",
  name: "Update Row",
  description: "Updates a row in a cloud database table. [See the documentation](https://support.appdrag.com/doc/Appdrag-Cloudbackend-npm)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    table: {
      propDefinition: [
        app,
        "table",
      ],
    },
    columnsToUpdate: {
      description: "The name of the columns to update in the table. Eg. `[\"column1\", \"column2\"]`",
      propDefinition: [
        app,
        "columns",
        ({ table }) => ({
          table,
        }),
      ],
    },
    values: {
      type: "string[]",
      label: "Values",
      description: "The values to update in the table for each **Column**. Eg. `[\"value1\", \"value2\"]`",
    },
    whereCondition: {
      type: "string",
      label: "Where Condition",
      description: "In this expression you can write your own conditions (eg. `column1 = ? or column2 = ?`). Depending on the number of `?` symbols likewise you need to add the same number of **Where Values**.",
    },
    whereValues: {
      type: "string[]",
      label: "Where Values",
      description: "This is the list of **values** that will match every `?` symbol in the **Where Condition** expression. Eg. `[\"value1\", \"value2\"]`",
    },
  },
  methods: {
    updateRow({
      table, columnsToUpdate, values, whereCondition, whereValues, ...args
    } = {}) {
      return this.app.executeRawQuery({
        query: `
          UPDATE ${table}
            SET ${utils.parseArray(columnsToUpdate).map((column) => `${column} = ?`)}
            WHERE ${whereCondition}
        `,
        values: [
          ...utils.parseArray(values),
          ...utils.parseArray(whereValues),
        ],
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      updateRow,
      table,
      columnsToUpdate,
      values,
      whereCondition,
      whereValues,
    } = this;

    const response = await updateRow({
      step,
      table,
      columnsToUpdate,
      values,
      whereCondition,
      whereValues,
    });

    step.export("$summary", `Successfully updated row in table \`${table}\``);

    return response;
  },
};
