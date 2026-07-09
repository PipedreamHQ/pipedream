import rendex from "../../rendex.app.mjs";

export default {
  key: "rendex-get-account",
  name: "Get Account",
  description: "Get your Rendex plan and this month's usage (credits used/limit/remaining), rate limit, and recommended upgrade. Read-only and free (no credits charged). [See the documentation](https://rendex.dev/docs/api-reference#get-account).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rendex,
  },
  async run({ $ }) {
    const response = await this.rendex.getAccount({
      $,
    });

    const data = response.data;
    const usage = data?.usage ?? {};
    const limitLabel = usage.unlimited
      ? "unlimited"
      : usage.limit;
    const remainingLabel = usage.unlimited
      ? "unlimited"
      : usage.remaining;
    $.export("$summary", `Plan: ${data?.plan} — ${remainingLabel}/${limitLabel} credits left`);
    return data;
  },
};
