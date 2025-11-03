import app from "../../parsio_io.app.mjs";

export default {
  key: "parsio_io-delete-mailbox",
  name: "Delete Mailbox",
  description: "Delete the specified mailbox. [See the documentation](https://help.parsio.io/public-api/parsio-public-api#delete-a-mailbox)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    mailboxId: {
      propDefinition: [
        app,
        "mailboxId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteMailbox({
      $,
      mailboxId: this.mailboxId,
    });
    $.export("$summary", "Successfully deleted mailbox");
    return response;
  },
};
