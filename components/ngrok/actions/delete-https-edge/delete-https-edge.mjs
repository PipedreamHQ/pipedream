import app from "../../ngrok.app.mjs";

export default {
  key: "ngrok-delete-https-edge",
  name: "Delete HTTPS Edge",
  description: "Delete an HTTPS Edge. [See the documentation](https://ngrok.com/docs/api/resources/edges-https/#delete-https-edge).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    edgeId: {
      propDefinition: [
        app,
        "edgeId",
      ],
    },
  },
  methods: {
    deleteHTTPSEdge({
      edgeId, ...args
    } = {}) {
      return this.app.delete({
        path: `/edges/https/${edgeId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deleteHTTPSEdge,
      edgeId,
    } = this;
    await deleteHTTPSEdge({
      $,
      edgeId,
    });
    $.export("$summary", "Successfully deleted HTTPS edge.");
    return {
      success: true,
    };
  },
};
