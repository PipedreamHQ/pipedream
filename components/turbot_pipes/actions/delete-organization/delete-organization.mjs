import app from "../../turbot_pipes.app.mjs";

export default {
  key: "turbot_pipes-delete-organization",
  name: "Delete Organization",
  description: "Deletes the specified organization. [See the documentation](https://redocly.github.io/redoc/?url=https://pipes.turbot.com/api/latest/docs/openapi.json&nocors#tag/orgs/operation/org_delete)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    orgHandle: {
      propDefinition: [
        app,
        "orgHandle",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteOrganization({
      $,
      orgHandle: this.orgHandle,
    });

    $.export("$summary", `Successfully deleted organization with handle ${this.orgHandle}`);

    return response;
  },
};
