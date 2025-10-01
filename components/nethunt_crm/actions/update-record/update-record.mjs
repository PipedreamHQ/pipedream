import nethuntCrm from "../../nethunt_crm.app.mjs";

export default {
  key: "nethunt_crm-update-record",
  name: "Update Record",
  description: "Updates an existing record. [See docs here](https://nethunt.com/integration-api#update-record)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    nethuntCrm,
    folderId: {
      propDefinition: [
        nethuntCrm,
        "folderId",
      ],
    },
    recordId: {
      propDefinition: [
        nethuntCrm,
        "recordId",
        (c) => ({
          folderId: c.folderId,
        }),
      ],
    },
    fieldActions: {
      type: "object",
      label: "Field Actions",
      description: "The field actions to perform on the record. [More information here](https://nethunt.com/integration-api#update-record).",
    },
    overwrite: {
      type: "boolean",
      label: "Overwrite",
      description: "Default \"overwrite\" setting for the field actions.",
      default: false,
    },
  },
  async run({ $ }) {
    const fieldActions = typeof this.fieldActions === "string"
      ? JSON.parse(this.fieldActions)
      : this.fieldActions;

    const response = await this.nethuntCrm.updateRecord({
      recordId: this.recordId,
      overwrite: this.overwrite,
      data: {
        fieldActions,
      },
    });

    $.export("$summary", "Successfully updated record");

    return response;
  },
};
