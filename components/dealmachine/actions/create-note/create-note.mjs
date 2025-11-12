import dealmachine from "../../dealmachine.app.mjs";

export default {
  key: "dealmachine-create-note",
  name: "Create Note",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a note for the lead. [See the documentation](https://docs.dealmachine.com/#ee15a741-b856-42dd-af34-19dca1d48f42)",
  type: "action",
  props: {
    dealmachine,
    leadId: {
      propDefinition: [
        dealmachine,
        "leadId",
      ],
    },
    note: {
      type: "string",
      label: "Note",
      description: "A body of text to create a note for the lead.",
    },
  },
  async run({ $ }) {
    const {
      dealmachine,
      leadId,
      ...data
    } = this;

    const { data: response } = await dealmachine.createNote({
      $,
      leadId,
      data,
    });

    $.export("$summary", `A note with Id: ${response.id} was successfully created!`);
    return response;
  },
};
