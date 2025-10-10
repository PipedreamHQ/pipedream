import constants from "../../common/constants.mjs";
import monday from "../../monday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "monday-create-column",
  name: "Create Column",
  description: "Creates a column. [See the documentation](https://developer.monday.com/api-reference/reference/columns#create-a-column)",
  type: "action",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
      description: "The title of the new column",
    },
    columnType: {
      type: "string",
      label: "Column Type",
      description: "The type of the new column",
      options: constants.COLUMN_TYPE_OPTIONS,
      reloadProps: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the new column",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if ([
      "status",
      "dropdown",
    ].includes(this.columnType)) {
      props.defaults = {
        type: "string",
        label: "Custom Labels (Defaults)",
        description: "The new column's custom labels (defaults). For use with column types `status` or `dropdown`. Should be an object in the format `{ \"1\": \"Technology\", \"2\": \"Marketing\" }` where each key is the label ID and each value is the label text. [See the documentation](https://developer.monday.com/api-reference/reference/columns#create-a-status-or-dropdown-column-with-custom-labels) for more information.",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    let { defaults } = this;
    if (defaults) {
      try {
        if (this.columnType === "status") {
          defaults = JSON.stringify({
            labels: JSON.parse(defaults),
          });
        } else if (this.columnType === "dropdown") {
          const obj = JSON.parse(defaults);
          defaults = JSON.stringify({
            settings: {
              labels: Object.entries(obj).map(([
                id,
                name,
              ]) => ({
                id: Number(id),
                name,
              })),
            },
          });
        }
      } catch (err) {
        throw new ConfigurationError(`Error parsing \`Custom Labels\` as JSON: "${err}"`);
      }
    }
    const {
      data,
      errors,
      error_message: errorMessage,
    } =
      await this.monday.createColumn({
        boardId: +this.boardId,
        title: this.title,
        columnType: this.columnType,
        defaults,
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
