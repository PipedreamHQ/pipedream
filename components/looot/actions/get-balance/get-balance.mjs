import looot from "../../looot.app.mjs";

export default {
  key: "looot-get-balance",
  name: "Get Balance",
  description: "Read the available prepaid credit and the top-up link. Free. [See the documentation](https://docs.looot.ai)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    looot,
  },
  async run({ $ }) {
    const response = await this.looot.getBalance({
      $,
    });
    $.export("$summary", "Fetched looot balance");
    return response;
  },
};
