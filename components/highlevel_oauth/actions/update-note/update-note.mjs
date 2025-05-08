import common from "../../common/base.mjs";

export default {
  ...common,
  key: "highlevel_oauth-update-note",
  name: "Update Note",
  description: "Updates a note associated with a contact. [See the documentation](https://highlevel.stoplight.io/docs/integrations/71814e115658f-update-note)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    contactId: {
      propDefinition: [
        common.props.app,
        "contactId",
      ],
      description: "The contact that the note is associated with",
    },
    noteId: {
      propDefinition: [
        common.props.app,
        "noteId",
        (c) => ({
          contactId: c.contactId,
        }),
      ],
    },
    body: {
      type: "string",
      label: "Body",
      description: "The body of the note",
    },
  },
  async run({ $ }) {
    const response = await this.app.updateNote({
      $,
      contactId: this.contactId,
      noteId: this.noteId,
      data: {
        body: this.body,
      },
    });
    $.export("$summary", `Successfully updated note (ID: ${this.noteId})`);
    return response;
  },
};
