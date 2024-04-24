import opsgenie from "../../opsgenie.app.mjs";

export default {
  key: "opsgenie-add-note-alert",
  name: "Add Note to Alert",
  description: "Adds a note to an existing alert in Opsgenie",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    opsgenie,
    note: opsgenie.propDefinitions.note,
    identifierType: opsgenie.propDefinitions.identifierType,
    id: opsgenie.propDefinitions.id,
  },
  async run({ $ }) {
    const response = await this.opsgenie.addNoteToAlert({
      id: this.id,
      note: this.note,
      identifierType: this.identifierType,
    });
    $.export("$summary", `Successfully added note to alert with ID: ${this.id}`);
    return response;
  },
};
