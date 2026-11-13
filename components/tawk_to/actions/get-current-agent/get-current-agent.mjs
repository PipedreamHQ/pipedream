import tawk_to from "../../tawk_to.app.mjs";

export default {
  key: "tawk_to-get-current-agent",
  name: "Get Current Agent",
  description:
    "Retrieve account and profile details for the currently authenticated agent. Takes no input parameters. Returns the agent's ID, name, email, and role. Use this to verify agent credentials, discover your agent ID, or personalize automated support workflows. [See the documentation](https://developer.tawk.to/).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tawk_to,
  },
  async run({ $ }) {
    const response = await this.tawk_to.getMe({
      $,
    });

    const agent = response?.data || response;
    const name = agent?.name || agent?.email || agent?.id || "agent";
    $.export("$summary", `Successfully retrieved agent details for ${name}`);
    return response;
  },
};
