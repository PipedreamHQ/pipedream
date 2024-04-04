import dex from "../../dex.app.mjs";

export default {
  key: "dex-create-note",
  name: "Create Note",
  description: "Establishes a brand new note within dex. The 'title' and 'content' props are vital for this action. 'tags' can be added as an optional prop to categorize and efficiently search the notes.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    dex,
    title: {
      type: "string",
      label: "Note Title",
      description: "The title of the note",
    },
    content: {
      type: "string",
      label: "Note Content",
      description: "The content of the note",
    },
    tags: {
      type: "string[]",
      label: "Note Tags",
      description: "The tags for categorizing the note",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dex.createNote({
      title: this.title,
      content: this.content,
      tags: this.tags,
    });

    $.export("$summary", `Successfully created note with title: ${this.title}`);
    return response;
  },
};
