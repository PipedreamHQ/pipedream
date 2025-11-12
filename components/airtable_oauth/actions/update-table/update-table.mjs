import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-update-table",
  name: "Update Table",
  description: "Update an existing table. [See the documentation](https://airtable.com/developers/web/api/update-table)",
  version: "0.0.14",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      type: "string",
      label: "Name",
      description: "The updated name of the table",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The updated description of the table",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {};
    if (this.name) {
      data.name = this.name;
    }
    if (this.description) {
      data.description = this.description;
    }
    const response = await this.airtable.updateTable({
      baseId: this.baseId.value,
      tableId: this.tableId.value,
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully updated table with ID ${response.id}.`);
    }

    return response;
  },
};
