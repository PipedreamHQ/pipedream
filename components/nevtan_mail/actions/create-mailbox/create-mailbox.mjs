import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-create-mailbox",
  name: "Create Mailbox",
  description: "Create a mailbox on one of your verified domains. Requires an admin API key.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    username: {
      type: "string",
      label: "Username",
      description: "The local part of the address, so `sales` creates `sales@yourdomain.com`.",
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    name: {
      type: "string",
      label: "Full Name",
      description: "The display name shown on mail sent from this mailbox.",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The initial password for the mailbox. The user is asked to change it at first sign-in.",
      secret: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createMailbox({
      $,
      data: {
        username: this.username,
        domain: this.domain,
        name: this.name,
        password: this.password,
      },
    });
    $.export("$summary", `Created mailbox ${response.email ?? this.username} successfully`);
    return response;
  },
};
