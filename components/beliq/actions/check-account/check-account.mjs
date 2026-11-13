import beliq from "../../beliq.app.mjs";

export default {
  key: "beliq-check-account",
  name: "Check Account",
  description: "Check that the connected beliq API key works and return its account, plan and remaining document quota. Use it before a batch run to see how many documents are left, or to find out why another beliq action failed to authenticate. Costs no quota, unlike **Generate Invoice**, **Validate Invoice**, **Parse Invoice** and **Convert Invoice**, which each use one document. [See the documentation](https://docs.beliq.eu/api-reference/authentication/#verifying-a-key)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    beliq,
  },
  async run({ $ }) {
    const account = await this.beliq.getAccount();
    $.export("$summary", "beliq API key is valid");
    return {
      success: true,
      account,
    };
  },
};
