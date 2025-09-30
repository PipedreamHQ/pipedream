import app from "../../slite.app.mjs";

export default {
  key: "slite-fetch-sub-docs",
  name: "Fetch Sub-Documents",
  description: "Fetches a certain number of sub-documents related to a parent document in Slite. [See the documentation](https://developers.slite.com/reference/getnotechildren)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    noteId: {
      label: "Parent Note ID",
      description: "The ID of the parent note.",
      propDefinition: [
        app,
        "noteId",
      ],
    },
  },
  methods: {
    listSubDocuments({
      noteId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/notes/${noteId}/children`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      listSubDocuments,
      noteId,
    } = this;

    const response = await listSubDocuments({
      $,
      noteId,
    });

    $.export("$summary", `Successfully fetched \`${response.notes.length}\` sub-document(s)`);
    return response;
  },
};
