import adalo from "../../adalo.app.mjs";

export default {
  key: "adalo-update-record",
  name: "Update Record",
  description: "Update a record. [See docs here](https://help.adalo.com/integrations/the-adalo-api/collections)",
  version: "0.0.2",
  type: "action",
  props: {
    adalo,
    recordId: {
      label: "Record ID",
      description: "The ID of a record",
      type: "integer",
    },
    data: {
      label: "Data",
      description: "The data to update record. E.g. `{ \"Email\": \"string\", \"Username\": \"string\", \"Full Name\": \"string\" }`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.adalo.updateRecord({
      $,
      recordId: this.recordId,
      data: JSON.parse(this.data),
    });

    $.export("$summary", `Successfully updated record with ID ${response.id}`);

    return response;
  },
};
