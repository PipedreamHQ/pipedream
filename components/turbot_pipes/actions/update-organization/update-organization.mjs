import app from "../../turbot_pipes.app.mjs";

export default {
  key: "turbot_pipes-update-organization",
  name: "Update Organization",
  description: "Updates an organization. [See the documentation](https://redocly.github.io/redoc/?url=https://pipes.turbot.com/api/latest/docs/openapi.json&nocors#tag/Orgs/operation/org_update)",
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
    handle: {
      propDefinition: [
        app,
        "handle",
      ],
    },
    displayName: {
      propDefinition: [
        app,
        "displayName",
      ],
    },
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.updateOrganization({
      $,
      orgHandle: this.orgHandle,
      data: {
        display_name: this.displayName,
        url: this.url,
        handle: this.handle,
      },
    });

    $.export("$summary", `Successfully updated the organization with handle ${this.orgHandle}`);

    return response;
  },
};
