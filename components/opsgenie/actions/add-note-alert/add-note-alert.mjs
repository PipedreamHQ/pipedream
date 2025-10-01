import opsgenie from "../../opsgenie.app.mjs";

export default {
  key: "opsgenie-add-note-alert",
  name: "Add Note to Alert",
  description: "Adds a note to an existing alert in Opsgenie. [See the documentation](https://docs.opsgenie.com/docs/alert-api#add-note-to-alert)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    opsgenie,
    alertId: {
      propDefinition: [
        opsgenie,
        "alertId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "Alert note to add",
    },
  },
  async run({ $ }) {
    const response = await this.opsgenie.addNoteToAlert({
      $,
      alertId: this.alertId,
      data: {
        note: this.note,
      },
    });
    $.export("$summary", `Successfully added note to alert with ID: ${this.alertId}`);
    return response;
  },
};
