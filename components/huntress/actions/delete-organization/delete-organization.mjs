import app from "../../huntress.app.mjs";

export default {
  key: "huntress-delete-organization",
  name: "Delete Organization",
  description: "Delete the specified organization. This removes the organization and associated configurations across the Huntress Platform, including Managed SAT. [See the documentation](https://api.huntress.io/docs#tag/organizations/delete/v1/organizations/{id})",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.app.deleteOrganization({
      $,
      id: this.organizationId,
    });

    $.export("$summary", `Successfully deleted organization \`${this.organizationId}\``);

    return response;
  },
};
