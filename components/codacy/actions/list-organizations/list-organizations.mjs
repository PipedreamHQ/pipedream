import app from "../../codacy.app.mjs";

export default {
  key: "codacy-list-organizations",
  name: "List Organizations",
  description: "List organizations for the authenticated user. [See the documentation](https://api.codacy.com/api/api-docs#listorganizations)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    provider: {
      propDefinition: [
        app,
        "provider",
      ],
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app.listOrganizations({
      $,
      provider: this.provider,
    });

    $.export("$summary", "Successfully listed organizations");

    return response;
  },
};
