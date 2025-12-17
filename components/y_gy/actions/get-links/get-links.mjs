import app from "../../y_gy.app.mjs";

export default {
  key: "y_gy-get-links",
  name: "Get Links",
  description: "Get a list of the links created by the authenticated account [See the documentation](https://app.y.gy/docs/api-docs/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getLinks({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response.links.length} link(s)`);

    return response;
  },
};
