import {
  capitalizeWord, getColumnOptions,
} from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";

export default {
  props: {
    columns: {
      propDefinition: [
        monday,
        "column",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      label: "Columns",
      type: "string[]",
      description: "Which item columns to set values for (array or comma-separated string)",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.columns) {
      return props;
    }
    const columns = Array.isArray(this.columns)
      ? this.columns
      : this.columns.split(",").map((c) => c.trim())
        .filter(Boolean);
    const columnData = await this.monday.listColumns({
      boardId: +this.boardId,
    });
    for (const column of columns) {
      let description, options;
      options = getColumnOptions(columnData, column);
      if (column === "person") {
        description = "The ID of a person/user";
      } else if (column === "date4") {
        description = "A date string in `YYYY-MM-DD` format, e.g. `2022-09-02`";
      } else if (options) {
        description = `Select a value from the list for column "${column}".`;
      } else {
        description = `Value for column "${column}". See the [Column Type Reference](https://developer.monday.com/api-reference/reference/column-types-reference) to learn more about entering column type values.`;
      }
      props[column] = {
        type: "string",
        label: capitalizeWord(column),
        description,
        options,
      };
    }
    return props;
  },
  methods: {
    capitalizeWord,
    getEmailValue(value) {
      let email = value;
      if (typeof value === "string") {
        try {
          email = JSON.parse(value);
        } catch {
          email = {
            text: value,
            email: value,
          };
        }
      }
      return email;
    },
  },
  async run({ $ }) {
    const columnValues = {};
    const columns = Array.isArray(this.columns)
      ? this.columns
      : this.columns?.split(",").map((c) => c.trim()) ?? [];
    if (columns.length > 0) {
      for (const column of columns) {
        if (column === "email") {
          columnValues[column] = this.getEmailValue(this[column]);
          continue;
        }
        columnValues[column] = this[column];
      }
    }
    const {
      data,
      errors,
      error_message: errorMessage,
    } =
      await this.sendRequest({
        columnValues,
      });

    if (errors) {
      throw new Error(`Failed to create item: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to create item: ${errorMessage}`);
    }

    const itemId = this.getItemId(data);

    $.export("$summary", `Successfully created a new item with ID: ${itemId}`);

    return itemId;
  },
};
