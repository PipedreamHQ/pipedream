import app from "../../snipe_it.app.mjs";

export default {
  key: "snipe_it-get-license",
  name: "Get License",
  description: "Retrieves license details including seat count, expiration, and current usage metrics. Note: The response returns 'product_key' but uses 'serial' field for POST/PUT/PATCH requests. [See the documentation](https://snipe-it.readme.io/reference/licensesid)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    licenseId: {
      propDefinition: [
        app,
        "licenseId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      licenseId,
    } = this;

    const response = await app.getLicense({
      $,
      licenseId,
    });

    $.export("$summary", `Successfully retrieved license with ID \`${response.id}\``);
    return response;
  },
};
