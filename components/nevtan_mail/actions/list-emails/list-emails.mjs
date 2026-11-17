import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-list-emails",
  name: "List Emails",
  description: "Retrieve the newest emails from a folder in your NevTan Mail mailbox. Returns at most 50 emails, newest first. Use **Get Email** to fetch a full body. [See the documentation](https://mail.nevtan.com/integrations)",
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
    folder: {
      propDefinition: [
        app,
        "folder",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listEmails({
      $,
      params: {
        folder: this.folder,
        limit: this.limit,
      },
    });
    $.export("$summary", `Found ${response.length} email${response.length === 1
      ? ""
      : "s"} in ${this.folder}`);
    return response;
  },
};
