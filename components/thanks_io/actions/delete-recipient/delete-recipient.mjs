import thanksIo from "../../thanks_io.app.mjs";

export default {
  key: "thanks_io-delete-recipient",
  name: "Delete Recipient",
  description: "Delete a recipient from a mailing list. [See the docs here](https://api-docs.thanks.io/#0d1ccb0e-c3a7-4096-a7e6-4eafafc64127)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    thanksIo,
    subAccount: {
      propDefinition: [
        thanksIo,
        "subAccount",
      ],
    },
    mailingList: {
      propDefinition: [
        thanksIo,
        "mailingList",
        (c) => ({
          subAccount: c.subAccount,
        }),
      ],
      description: "The mailing list to delete recipient from",
    },
    recipient: {
      propDefinition: [
        thanksIo,
        "recipients",
        (c) => ({
          mailingListId: c.mailingList,
        }),
      ],
      type: "string",
      description: "Recipient to delete",
    },
  },
  async run({ $ }) {
    const resp = await this.thanksIo.deleteRecipient(this.recipient, {
      $,
    });
    if (resp?.errors) {
      throw new Error(resp.errors);
    }
    $.export("$summary", "Successfully deleted recipient");
    return resp;
  },
};
