import app from "../../signalraven.app.mjs";

export default {
  key: "signalraven-get-icp",
  name: "Get ICP",
  description: "Fetch the workspace ideal customer profile: company size, industries, titles, personas and seniority. [See the documentation](https://signalraven.ai/developers/api)",
  type: "action",
  ai: "optimized",
  version: "0.0.1",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getIcp({
      $,
    });
    $.export("$summary", "Fetched the ICP profile.");
    return response;
  },
};
