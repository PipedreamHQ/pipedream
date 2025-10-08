import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-delete-list-member",
  name: "Delete List Member",
  description: "Permanently deletes a member. [See docs here](https://mailchimp.com/developer/marketing/api/list-members/delete-list-member/)",
  version: "0.0.2",
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
    subscriberHash: {
      propDefinition: [
        mailchimp,
        "subscriberHash",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const payload = {
      listId: this.listId,
      subscriberHash: this.subscriberHash,
    };
    await this.mailchimp.deleteListMember($, payload);
    $.export("$summary", "List member deleted");
  },
};
