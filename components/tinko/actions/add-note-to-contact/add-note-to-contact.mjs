import app from "../../tinko.app.mjs";

export default {
  key: "tinko-add-note-to-contact",
  name: "Add Note to Contact",
  description: "Add an internal note to a contact. Notes are visible only to the team in Tinko, never to the contact."
    + " Use **Find Contact** to find the contact ID."
    + " [See the documentation](https://docs.tinko.com.br/endpoints/contacts/#criar-nota-no-contato)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    contactId: {
      propDefinition: [
        app,
        "contactId",
      ],
    },
    content: {
      type: "string",
      label: "Note",
      description: "Text of the note, up to 5000 characters, e.g. `Asked for a call back on Monday`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.createContactNote({
      $,
      contactId: this.contactId,
      data: {
        content: this.content,
      },
    });

    $.export("$summary", `Successfully added a note to contact ${this.contactId}`);
    return response.data;
  },
};
