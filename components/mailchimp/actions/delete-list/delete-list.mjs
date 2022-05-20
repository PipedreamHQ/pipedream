import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-delete-list",
  name: "Delete List",
  description: "Deletes an existing list. [See docs here](https://mailchimp.com/developer/marketing/api/lists)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List ID",
      description: "The unique ID for the list.",
    },
  },
  async run({ $ }) {
    const response = await this.mailchimp.deleteList($, this.listId);
    response && $.export("$summary", "List deleted successfully");
    return response;
  },
};
