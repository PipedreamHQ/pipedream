import constants from "../../sources/common/constants.mjs";
import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-create-field",
  name: "Create Field",
  description: "Create a new field in a table. [See the documentation](https://airtable.com/developers/web/api/create-field)",
  version: "0.1.1",
  type: "action",
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Field Name",
      description: "The name of the field",
    },
    type: {
      type: "string",
      label: "Field Type",
      description: "The field type. [See the documentation](https://airtable.com/developers/web/api/model/field-type) for more information.",
      options: constants.FIELD_TYPES,
    },
    description: {
      type: "string",
      label: "Field Description",
      description: "The description of the field",
      optional: true,
    },
    options: {
      type: "object",
      label: "Field Options",
      description: "The options for the field as a JSON object, e.g. `{ \"color\": \"greenBright\" }`. Each type has a specific set of options - [see the documentation](https://airtable.com/developers/web/api/field-model) for more information.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      description, name, options, type,
    } = this;
    const response = await this.airtable.createField({
      baseId: this.baseId.value,
      tableId: this.tableId.value,
      data: {
        name,
        type,
        description,
        options: typeof options === "string"
          ? JSON.parse(options)
          : options,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created field with ID ${response.id}.`);
    }

    return response;
  },
};
