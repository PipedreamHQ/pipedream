import constants from "../../common/constants.mjs";
import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-column",
  name: "Create Column",
  description: "Creates a column. [See the docs here](https://developer.monday.com/api-reference/docs/columns-queries-1)",
  type: "action",
  version: "0.0.1",
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The new column's title.",
    },
    columnType: {
      type: "string",
      label: "Column Type",
      description: "The new column's title",
      options: constants.COLUMN_TYPE_OPTIONS,
    },
    defaults: {
      type: "object",
      label: "Defaults",
      description: "The new column's defaults.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The column's description.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      data,
      errors,
      error_message: errorMessage,
    } =
      await this.monday.createColumn({
        boardId: +this.boardId,
        title: this.title,
        columnType: this.columnType,
        defaults: this.defaults,
        description: this.description,
      });

    if (errors) {
      throw new Error(`Failed to create column: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to create column: ${errorMessage}`);
    }

    console.log( data);

    const { id } = data.create_column;

    $.export("$summary", `Successfully created a new column with ID: ${id}`);

    return id;
  },
};
