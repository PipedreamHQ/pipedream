import activecampaign from "../../activecampaign.app.mjs";

export default {
  key: "activecampaign-create-note",
  name: "Create Note",
  description: "Adds a note, arbitrary information to a contact, deal, or other Active Campaign objects. See the docs [here](https://developers.activecampaign.com/reference/create-a-note).",
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    activecampaign,
    note: {
      type: "string",
      label: "Note",
      description: "The note's text.",
    },
    reltype: {
      type: "string",
      label: "Type",
      description: "The related type where the note will be added to. Possible Values: `Activity`, `Deal`, `DealTask`, `Subscriber`, `CustomerAccount`",
      options: [
        "Activity",
        "Deal",
        "DealTask",
        "Subscriber",
        "CustomerAccount",
      ],
    },
    relid: {
      type: "integer",
      label: "ID",
      description: "Id of the related object where the note is being added.",
    },
  },
  async run({ $ }) {
    const {
      note,
      reltype,
      relid,
    } = this;

    const response = await this.activecampaign.createNote({
      data: {
        note: {
          note,
          reltype,
          relid,
        },
      },
    });

    $.export("$summary", `Successfully created a note with ID ${response.note.id}`);

    return response;
  },
};
