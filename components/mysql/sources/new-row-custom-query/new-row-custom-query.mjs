import common from "../common/table.mjs";
import { v4 as uuidv4 } from "uuid";

const { mysql } = common.props;

export default {
  ...common,
  key: "mysql-new-row-custom-query",
  name: "New Row (Custom Query)",
  description:
    "Emit new event when new rows are returned from a custom query. [See the docs here](https://dev.mysql.com/doc/refman/8.0/en/select.html)",
  version: "2.0.6",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    column: {
      propDefinition: [
        mysql,
        "column",
        (c) => ({
          table: c.table,
        }),
      ],
      label: "De-duplication Key",
      description:
        "The name of a column in the table to use for de-duplication",
      optional: true,
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
  methods: {
    ...common.methods,
    async listResults() {
      const {
        table, condition, values,
      } = this;

      const numberOfQuestionMarks = condition?.match(/\?/g)?.length;

      if (!numberOfQuestionMarks) {
        throw new Error(
          "No valid condition provided. At least one question mark character ? must be provided.",
        );
      }

      if (!Array.isArray(values)) {
        throw new Error(
          "No valid values provided. The values property must be an array.",
        );
      }

      if (values.length !== numberOfQuestionMarks) {
        throw new Error(
          "The number of values provided does not match the number of question marks ? in the condition.",
        );
      }

      const rows = await this.mysql.findRows({
        table,
        condition,
        values,
      });
      this.iterateAndEmitEvents(rows);
    },
    generateMeta(row) {
      const id = this.column
        ? row[this.column]
        : uuidv4();
      return {
        id,
        summary: `New Row ${id}`,
        ts: Date.now(),
      };
    },
  },
};
