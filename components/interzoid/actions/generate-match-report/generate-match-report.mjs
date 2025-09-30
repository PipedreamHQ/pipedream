import interzoid from "../../interzoid.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "interzoid-generate-match-report",
  name: "Generate Match Report",
  description: "Generate a Match Report using a dataset table or file (CSV/TSV/Excel). [See the documentation](https://connect.interzoid.com/data-matching-workflow)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    interzoid,
    category: {
      type: "string",
      label: "Matching Algorithm Type",
      description: "This category type indicates which set of Machine Learning and matching algorithms to make use of based on type of data content",
      options: constants.CATEGORY_OPTIONS,
    },
    source: {
      type: "string",
      label: "Database Connection Type",
      description: "Source of data, such as 'CSV', 'Snowflake', 'Postgres', etc.",
      options: constants.SOURCE_OPTIONS,
    },
    connection: {
      type: "string",
      label: "Connection String",
      description: "Connection string to access database, or in the case of a CSV or TSV file, use the full URL of the location of the file.",
    },
    table: {
      type: "string",
      label: "Table Name",
      description: "Table name to access the source data. Use \"CSV\" or \"TSV\" for delimited text files.",
    },
    column: {
      type: "string",
      label: "Match Column Name",
      description: "Column name within the table to access the source data. This is a number for CSV or TSV files, starting with number 1 from the left side of the file.",
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "An additional column from the source table to display in the output results, such as a primary key.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.interzoid.generateMatchReport({
      $,
      params: {
        category: this.category,
        source: this.source,
        connection: this.connection,
        table: this.table,
        column: this.column,
        reference: this.reference,
      },
    });

    $.export("$summary", "Successfully generated match report");

    return response;
  },
};
