import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-list-emails",
  name: "List Emails",
  description: "Retrieve the newest emails from a folder in your NevTan Mail mailbox.",
  version: "0.0.1",
  type: "action",
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
