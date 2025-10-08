import app from "../../ngrok.app.mjs";

export default {
  key: "ngrok-create-https-edge",
  name: "Create HTTPS Edge",
  description: "Create an HTTPS Edge. [See the documentation](https://ngrok.com/docs/api/resources/edges-https/#create-https-edge).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
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
    createHTTPSEdge(args = {}) {
      return this.app.post({
        path: "/edges/https",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createHTTPSEdge,
      description,
      hostports,
      metadata,
    } = this;

    const response = await createHTTPSEdge({
      $,
      data: {
        description,
        hostports,
        metadata: metadata && JSON.stringify(metadata),
      },
    });
    $.export("$summary", `Successfully created new HTTPS edge with ID \`${response.id}\`.`);
    return response;
  },
};
