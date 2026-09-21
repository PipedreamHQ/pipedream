import constants from "../../common/constants.mjs";
import monday from "../../monday.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

const COLUMN_TYPE_STATUS = "status";
const COLUMN_TYPE_DROPDOWN = "dropdown";
const DEFAULTS_SUPPORTED_COLUMN_TYPES = [
  COLUMN_TYPE_STATUS,
  COLUMN_TYPE_DROPDOWN,
];

export default {
  key: "monday-create-column",
  name: "Create Column",
  description: "Add a column to an existing board. Use when a board is missing a field you need before setting values with **Create Item** or **Update Column Values**. Set `Board ID`, `Title` and `Column Type` (e.g. `status`, `text`, `date`, `numbers`). `Custom Labels (Defaults)` is accepted only when `Column Type` is `status` or `dropdown` and is rejected for any other type. Example: Title `Priority`, Column Type `status`, Custom Labels `{ \"1\": \"High\", \"2\": \"Low\" }`. Returns the new column's ID as a string (e.g. `status_1`). Call **List Columns** afterwards to confirm the ID and the labels it accepts. [See the documentation](https://developer.monday.com/api-reference/reference/columns#create-a-column)",
  type: "action",
  ai: "optimized",
  version: "0.1.8",
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
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the new column",
      optional: true,
    },
    defaults: {
      type: "string",
      label: "Custom Labels (Defaults)",
      description: "The new column's custom labels (defaults). Only valid when `Column Type` is `status` or `dropdown` — setting it for any other column type fails. Should be a JSON object in the format `{ \"1\": \"Technology\", \"2\": \"Marketing\" }` where each key is the label ID and each value is the label text. [See the documentation](https://developer.monday.com/api-reference/reference/columns#create-a-status-or-dropdown-column-with-custom-labels) for more information",
      optional: true,
    },
  },
  async run({ $ }) {
    let { defaults } = this;
    if (defaults !== undefined) {
      if (!DEFAULTS_SUPPORTED_COLUMN_TYPES.includes(this.columnType)) {
        throw new ConfigurationError("`Custom Labels (Defaults)` is only supported for `status` and `dropdown` column types.");
      }
      try {
        if (this.columnType === COLUMN_TYPE_STATUS) {
          defaults = JSON.stringify({
            labels: JSON.parse(defaults),
          });
        } else if (this.columnType === COLUMN_TYPE_DROPDOWN) {
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
