import app from "../../turbot_pipes.app.mjs";

export default {
  key: "turbot_pipes-create-organization",
  name: "Create Organization",
  description: "Creates a new organization in Turbot Pipes. [See the documentation](https://redocly.github.io/redoc/?url=https://pipes.turbot.com/api/latest/docs/openapi.json&nocors#tag/Orgs/operation/org_create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
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
    orgHandle: {
      propDefinition: [
        app,
        "orgHandle",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createOrganization({
      $,
      data: {
        display_name: this.displayName,
        url: this.url,
        handle: this.orgHandle,
      },
    });

    $.export("$summary", `Successfully created organization with handle '${this.orgHandle}'`);

    return response;
  },
};
