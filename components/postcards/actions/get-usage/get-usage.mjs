import postcards from "../../postcards.app.mjs";

export default {
  key: "postcards-get-usage",
  name: "Get Usage",
  description: "Get the current export quota usage and active plan for the authenticated team. [See the docs](https://help.designmodo.com/article/537-api-getting-started).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postcards,
  },
  async run({ $ }) {
    const response = await this.postcards.getUsage({
      $,
    });
    $.export("$summary", "Fetched usage");
    return response;
  },
};
