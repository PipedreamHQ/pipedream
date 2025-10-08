import app from "../../salesflare.app.mjs";

export default {
  key: "salesflare-add-contact-to-account",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Add Contact To Account",
  description: "Adds a contact to an account [See the docs here](https://api.salesflare.com/docs#operation/postAccountsAccount_idContacts)",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountIds",
      ],
      type: "integer",
      label: "Account ID",
      description: "Account ID",
      optional: false,
    },
    contactIds: {
      propDefinition: [
        app,
        "contactId",
      ],
      type: "integer[]",
      label: "Contact IDs",
      description: "Contact IDs",
    },
  },
  async run ({ $ }) {
    const resp = await this.app.addContactsToAccount({
      $,
      accountId: this.accountId,
      data: this.contactIds.map(( id ) => ({
        id,
      })),
    });
    $.export("$summary", "Contact(s) has been added to the account successfully.");
    return resp;
  },
};
