import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-delete-a-list",
  name: "Delete A List",
  description: "Deletes an existing list. [See docs here](https://mailchimp.com/developer/marketing/api/lists)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List id",
      description: "The unique ID for the list.",
    },
  },
  async run({ $ }) {
    const response = await this.mailchimp.updateList($, this.listId);
    response && $.export("$summary", "List deleted");
    return response;
  },
};
