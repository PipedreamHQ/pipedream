import flatverify from "../../flatverify.app.mjs";

export default {
  key: "flatverify-get-account",
  name: "Get Account",
  description: "Get your Flatverify plan, its speed limit per minute, usage today and this minute, and free checks left."
    + " Every plan is unlimited; plans differ only in speed. Use it to confirm the connection works or to pace large lists."
    + " [See the documentation](https://flatverify.com/docs#limits)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    flatverify,
  },
  async run({ $ }) {
    const response = await this.flatverify.getAccount({
      $,
    });
    $.export("$summary", `Plan ${response.plan}, ${response.limits?.per_minute ?? "?"} checks a minute`);
    return response;
  },
};
