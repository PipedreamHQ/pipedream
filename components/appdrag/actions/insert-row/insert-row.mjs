import app from "../../appdrag.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "appdrag-insert-row",
  name: "Insert Row",
  description: "Inserts a new row into a cloud database table. [See the documentation](https://support.appdrag.com/doc/Appdrag-Cloudbackend-npm)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    columns: {
      description: "The columns to insert into the table. Eg. `['column1', 'column2']`",
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
      description: "The values to insert into the table. Eg. `['value1', 'value2']`",
    },
  },
  methods: {
    insertRow({
      table, columns, values, ...args
    } = {}) {
      return this.app.executeRawQuery({
        query: `
          INSERT INTO ${table} (${utils.parseArray(columns)})
            VALUES (${utils.parseArray(values).map(() => "?")})`,
        values: utils.parseArray(values),
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      insertRow,
      table,
      columns,
      values,
    } = this;

    const response = await insertRow({
      step,
      table,
      columns,
      values,
    });

    step.export("$summary", `Successfully inserted a new row into table \`${table}\``);

    return response;
  },
};
