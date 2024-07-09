import parma from "../../parma.app.mjs";

export default {
  key: "parma-create-note",
  name: "Create Note",
  description: "Adds a new note in Parma. [See the documentation](https://developers.parma.ai/api-docs/index.html)",
  version: "0.0.1",
  type: "action",
  props: {
    parma,
    relationshipId: {
      propDefinition: [
        parma,
        "relationshipId",
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the note.",
    },
    datetime: {
      type: "string",
      label: "Date Time",
      description: "The datetime of the note.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.parma.addNote({
      $,
      data: {
        relationship_ids: this.relationshipId,
        body: this.body,
        datetime: this.datetime,
      },
    });

    $.export("$summary", `Successfully created note with Id: ${response.data.id}`);
    return response;
  },
};
