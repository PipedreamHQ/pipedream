import app from "../../slite.app.mjs";

export default {
  key: "slite-create-doc",
  name: "Create Document",
  description: "Creates a new document within a chosen parent document or private channel. [See the documentation](https://developers.slite.com/reference/createnote)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
    parentNoteId: {
      label: "Parent Note ID",
      description: "The ID of the parent note.",
      optional: true,
      propDefinition: [
        app,
        "noteId",
      ],
    },
    markdown: {
      optional: true,
      propDefinition: [
        app,
        "markdown",
      ],
    },
  },
  methods: {
    createDocument(args = {}) {
      return this.app.post({
        path: "/notes",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createDocument,
      title,
      parentNoteId,
      markdown,
    } = this;

    const response = await createDocument({
      $,
      data: {
        title,
        parentNoteId,
        markdown,
      },
    });

    $.export("$summary", `Successfully created document with ID \`${response.id}\``);
    return response;
  },
};
