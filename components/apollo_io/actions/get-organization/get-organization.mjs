import app from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-get-organization",
  name: "Get Organization",
  description: "Fetch a single organization from Apollo by its ID. Requires a master API key. Use **Search For Organizations** to discover IDs. [See the documentation](https://docs.apollo.io/reference/get-complete-organization-info)",
  type: "action",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
  },
  async run({ $ }) {
    const { organization } = await this.app.getOrganization({
      $,
      organizationId: this.organizationId,
    });
    $.export("$summary", `Successfully fetched organization ${this.organizationId}.`);
    return organization;
  },
};
