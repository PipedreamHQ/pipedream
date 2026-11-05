import app from "../../postpulse.app.mjs";

export default {
  key: "postpulse-list-accounts",
  name: "List Accounts",
  description: "List the social media accounts connected to PostPulse, with their IDs and platforms. Accounts with `needsReauthorization: true` must be reconnected in PostPulse before posting. [See the documentation](https://post-pulse.com/api-docs#accounts)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const accounts = await this.app.listAccounts({
      $,
    });
    $.export("$summary", `Found ${accounts.length} connected account${accounts.length === 1
      ? ""
      : "s"}`);
    return accounts;
  },
};
