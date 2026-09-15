import katto from "../../katto.app.mjs";

export default {
  key: "katto-get-usage",
  name: "Get Usage",
  description:
    "Get your plan and remaining monthly video quota. [See the documentation](https://katto.tech/docs/api)",
  version: "0.1.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    katto,
  },
  async run({ $ }) {
    const response = await this.katto.getUsage({
      $,
    });
    $.export("$summary", "Retrieved plan and usage");
    return response;
  },
};
