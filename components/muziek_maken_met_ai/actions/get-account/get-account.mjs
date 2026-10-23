import muziekMakenMetAi from "../../muziek_maken_met_ai.app.mjs";

export default {
  key: "muziek_maken_met_ai-get-account",
  name: "Get Account",
  description: "Get the credit balance and rate limits of the connected developer account. [See the documentation](https://muziekmakenmetai.nl/developers/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  ai: "optimized",
  props: {
    muziekMakenMetAi,
  },
  async run({ $ }) {
    const account = await this.muziekMakenMetAi.getAccount($);

    $.export("$summary", `Fetched account ${account.key_prefix ?? ""}: ${account.credits ?? 0} credits available`);

    return account;
  },
};
