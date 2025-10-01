import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-add-email-in-unsubscribes",
  name: "Add Email In Unsubscribes",
  description: "This action adds a lead in the unsubscribed list. [See the docs here](https://developer.lemlist.com/#add-an-email-address-in-the-unsubscribes)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lemlist,
    email: {
      propDefinition: [
        lemlist,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lemlist.addEmailToUnsubscribes({
      $,
      email: this.email,
    });

    $.export("$summary", `Successfully added ${this.email} lead to unsubscribed list!`);
    return response;
  },
};
