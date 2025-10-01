import app from "../../ngrok.app.mjs";

export default {
  key: "ngrok-get-https-edge",
  name: "Get HTTPS Edge",
  description: "Get the details of an HTTPS Edge. [See the documentation](https://ngrok.com/docs/api/resources/edges-https/#get-https-edge).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    getHTTPSEdge({
      edgeId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/edges/https/${edgeId}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getHTTPSEdge,
      edgeId,
    } = this;
    const response = await getHTTPSEdge({
      $,
      edgeId,
    });
    $.export("$summary", `Successfully retrieved HTTPS edge with ID \`${response.id}\`.`);
    return response;
  },
};
