import app from "../../ngrok.app.mjs";

export default {
  key: "ngrok-update-https-edge",
  name: "Update HTTPS Edge",
  description: "Updates an HTTPS Edge. [See the documentation](https://ngrok.com/docs/api/resources/edges-https/#update-https-edge).",
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
    description: {
      propDefinition: [
        app,
        "description",
      ],
    },
    hostports: {
      propDefinition: [
        app,
        "hostports",
      ],
    },
    metadata: {
      propDefinition: [
        app,
        "metadata",
      ],
    },
  },
  methods: {
    updateHTTPSEdge({
      edgeId, ...args
    } = {}) {
      return this.app.patch({
        path: `/edges/https/${edgeId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      updateHTTPSEdge,
      edgeId,
      description,
      hostports,
      metadata,
    } = this;

    const response = await updateHTTPSEdge({
      $,
      edgeId,
      data: {
        description,
        hostports,
        metadata: metadata && JSON.stringify(metadata),
      },
    });
    $.export("$summary", `Successfully updated Agent Ingress ID \`${response.id}\`.`);
    return response;
  },
};
