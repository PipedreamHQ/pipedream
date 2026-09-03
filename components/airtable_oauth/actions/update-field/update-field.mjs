import common from "../common/common.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "airtable_oauth-update-field",
  name: "Update Field",
  description: "Update an existing field in a table. [See the documentation](https://airtable.com/developers/web/api/update-field)",
  version: "0.0.16",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    fieldId: {
      propDefinition: [
        common.props.airtable,
        "sortFieldId",
      ],
      label: "Field ID",
      description: "The ID of the field to update, e.g. `fldXXXXXXXXXXXXXX`. Use **List Tables** to look up a table's field IDs.",
      optional: false,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name of the field",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The new description of the field",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.name && !this.description) {
      throw new ConfigurationError("At least one of `Name` or `Description` must be provided.");
    }

    const data = {};
    if (this.name) {
      data.name = this.name;
    }
    if (this.description) {
      data.description = this.description;
    }
    const response = await this.airtable.updateField({
      baseId: this.baseId,
      tableId: this.tableId,
      fieldId: this.fieldId,
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated field with ID ${response.id}.`);
    }

    return response;
  },
};
