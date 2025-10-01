import lemlist from "../../lemlist.app.mjs";

export default {
  key: "lemlist-delete-email-from-unsubscribes",
  name: "Delete An Email From Unsubscribes",
  description: "This action deletes a lead in the unsubscribed list. [See the docs here](https://developer.lemlist.com/#delete-an-email-address-from-the-unsubscribes)",
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
    const response = await this.lemlist.deleteEmailFromUnsubscribes({
      $,
      email: this.email,
    });

    $.export("$summary", `Successfully deleted ${this.email} lead from unsubscribed list!`);
    return response;
  },
};
