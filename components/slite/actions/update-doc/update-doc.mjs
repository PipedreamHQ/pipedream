import app from "../../slite.app.mjs";

export default {
  key: "slite-update-doc",
  name: "Update Document",
  description: "Modifies a Slite document. [See the documentation](https://developers.slite.com/reference/updatenote)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    noteId: {
      propDefinition: [
        app,
        "noteId",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
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
    updateDocument({
      noteId, ...args
    } = {}) {
      return this.app.put({
        path: `/notes/${noteId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateDocument,
      noteId,
      title,
      markdown,
    } = this;

    const response = await updateDocument({
      $,
      noteId,
      data: {
        title,
        markdown,
      },
    });

    $.export("$summary", `Updated document with ID \`${response.id}\``);
    return response;
  },
};
