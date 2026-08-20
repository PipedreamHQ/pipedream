import app from "../../mailtrap.app.mjs";

export default {
  name: "List Suppressions",
  description:
    "List email addresses suppressed from receiving mail (hard bounces, spam complaints, unsubscribes, manual imports). " +
    "[See the documentation](https://docs.mailtrap.io/developers/email-sending/suppressions#get-api-suppressions)",
  key: "mailtrap-list-suppressions",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Filter suppressions by a specific email address.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { email } = this;

    const response = await this.app.listSuppressions({
      $,
      params: {
        ...(email && {
          email,
        }),
      },
    });

    const count = response?.length ?? 0;
    $.export("$summary", `Found ${count} suppression(s)`);
    return response;
  },
};
