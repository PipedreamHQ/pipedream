import productboard from "../../productboard.app.mjs";

export default {
  key: "productboard-create-note",
  name: "Create Note",
  description: "Create a new note. [See the docs here](https://developer.productboard.com/#operation/create_note)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    productboard,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new note",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the new note in HTML-encoded rich text",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address to be attached to the note",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "A set of tags for categorizing the note; tag uniqueness is case- and diacritic-insensitive",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      title: this.title,
      content: this.content,
      user: {
        email: this.email,
      },
      tags: this.tags,
    };
    const { data: note } = await this.productboard.createNote(data, $);

    $.export("$summary", `Successfully created note with ID ${note.id}`);

    return note;
  },
};
