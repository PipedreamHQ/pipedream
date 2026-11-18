import app from "../../nevtan_mail.app.mjs";

export default {
  key: "nevtan_mail-create-mailbox",
  name: "Create Mailbox",
  description: "Create a mailbox on one of your verified domains. Requires an admin API key. [See the documentation](https://mail.nevtan.com/docs/mail-api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
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
      description: "The local part of the address, so `sales` creates `sales@yourdomain.com`. e.g. `sales`",
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
      description: "The display name shown on mail sent from this mailbox. e.g. `Sales Team`",
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "The initial password for the mailbox, which the user is asked to change at first sign-in. Must be 8–64 characters with no spaces, and include an uppercase letter, a lowercase letter, a number and a special character. e.g. `Temp-Passw0rd!`",
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
