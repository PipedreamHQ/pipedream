import mailosaur from "../../mailosaur.app.mjs";

export default {
  key: "mailosaur-delete-email",
  name: "Delete Email",
  description: "Deletes an email from a Mailosaur server using its email ID. [See the documentation](https://mailosaur.com/docs/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailosaur,
    serverId: {
      propDefinition: [
        mailosaur,
        "serverId",
      ],
    },
    emailId: {
      propDefinition: [
        mailosaur,
        "emailId",
        ({ serverId }) => ({
          serverId,
        }),
      ],
    },
  },
  async run({ $ }) {
    await this.mailosaur.deleteEmail({
      $,
      emailId: this.emailId,
    });
    $.export("$summary", `Successfully deleted email with ID ${this.emailId}`);
    return {
      emailId: this.emailId,
    };
  },
};
