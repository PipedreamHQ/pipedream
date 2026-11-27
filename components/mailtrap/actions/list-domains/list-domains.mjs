import app from "../../mailtrap.app.mjs";

export default {
  name: "List Domains",
  description:
    "List sending domains in your Mailtrap account, including their verification and compliance status. " +
    "[See the documentation](https://docs.mailtrap.io/developers/email-sending/domains#get-api-domains)",
  key: "mailtrap-list-domains",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.listDomains({
      $,
    });

    const count = response?.data?.length ?? 0;
    $.export("$summary", `Found ${count} domain(s)`);
    return response;
  },
};
