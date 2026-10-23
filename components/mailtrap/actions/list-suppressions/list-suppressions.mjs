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
    lastId: {
      type: "string",
      label: "Last ID",
      description: "Mailtrap returns at most 1,000 suppressions per request. To page through more, pass the `id` of the last suppression from the previous response here, e.g. `25bac214-6fce-4939-bee3-abcdc8f982a8`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      email, lastId,
    } = this;

    const response = await this.app.listSuppressions({
      $,
      params: {
        ...(email && {
          email,
        }),
        ...(lastId && {
          last_id: lastId,
        }),
      },
    });

    const count = response?.length ?? 0;
    $.export("$summary", `Found ${count} suppression(s)`);
    return response;
  },
};
