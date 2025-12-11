import app from "../../returnless.app.mjs";

export default {
  key: "returnless-list-shipments",
  name: "List Shipments",
  description: "List all shipments. [See the documentation](https://docs.returnless.com/docs/api-rest-reference/7daf3fa2c9bf9-list-all-shipments)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const resources = await this.app.getPaginatedResources({
      fn: this.app.listShipments,
      max: this.maxResults,
    });

    $.export("$summary", `Successfully retrieved ${resources.length} shipment(s)`);
    return resources;
  },
};
