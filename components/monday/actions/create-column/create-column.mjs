import constants from "../../common/constants.mjs";
import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-column",
  name: "Create Column",
  description: "Creates a column. [See the documentation](https://developer.monday.com/api-reference/reference/columns#create-a-column)",
  type: "action",
  version: "0.0.8",
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
      reloadProps: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The column's description.",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    const defaults = {
      type: "string",
      label: "Defaults",
      description: "The new column's defaults. For use with column types `status` or `dropdown`. [See the documentation](https://developer.monday.com/api-reference/reference/columns#create-a-status-or-dropdown-column-with-custom-labels) for additional information.",
      optional: true,
    };
    if (this.columnType === "status") {
      props.defaults = {
        ...defaults,
        default: "{\"labels\":{\"1\":\"Option1\",\"2\":\"Option2\",\"3\":\"Option3\",\"4\": \"Option4\"}}",
      };
    }
    if (this.columnType === "dropdown") {
      props.defaults = {
        ...defaults,
        default: "{\"settings\":{\"labels\":[{\"id\":1,\"name\":\"Option1\"}, {\"id\":2,\"name\":\"Option2\"}, {\"id\":3,\"name\":\"Option3\"}]}}",
      };
    }
    return props;
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
        defaults: this.defaults
          ? typeof this.defaults !== "string"
            ? JSON.stringify(this.defaults)
            : this.defaults
          : undefined,
        description: this.description,
      });

    if (errors) {
      throw new Error(`Failed to create column: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to create column: ${errorMessage}`);
    }

    const { id } = data.create_column;

    $.export("$summary", `Successfully created a new column with ID: ${id}`);

    return id;
  },
};
