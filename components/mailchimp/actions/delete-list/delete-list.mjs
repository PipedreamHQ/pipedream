import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-delete-list",
  name: "Delete List",
  description: "Deletes an existing list. [See docs here](https://mailchimp.com/developer/marketing/api/lists)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailchimp,
    listId: {
      propDefinition: [
        mailchimp,
        "listId",
      ],
      label: "List Id",
      description: "The unique ID of the list",
    },
  },
  async run({ $ }) {
    await this.mailchimp.deleteList($, this.listId);
    $.export("$summary", "List deleted successfully");
  },
};
