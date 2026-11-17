import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-find-emails",
  name: "Find Emails",
  description: "Search your NevTan Mail mailbox and return the matching emails. Use **Get Email** to fetch the full body of a returned ID. [See the documentation](https://mail.nevtan.com/integrations)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "What to search for, matched against sender, subject and body. e.g. `invoice 88`",
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.searchEmails({
      $,
      params: {
        q: this.query,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response.length} matching email${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
