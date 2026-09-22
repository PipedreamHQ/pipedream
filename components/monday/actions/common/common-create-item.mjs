import { parseColumnValues } from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";

export default {
  props: {
    columnValues: {
      propDefinition: [
        monday,
        "columnValues",
      ],
    },
  },
  methods: {
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
    const columnValues = parseColumnValues(this.columnValues) ?? {};
    if (columnValues.email) {
      columnValues.email = this.getEmailValue(columnValues.email);
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
