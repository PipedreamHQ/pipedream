import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-delete-list-member",
  name: "Delete A List Member",
  description: "Permanently deletes a member. [See docs here](https://mailchimp.com/developer/marketing/api/list-members/delete-list-member/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List id",
      description: "The unique id for the list.",
    },
    subscriberHash: {
      type: "string",
      label: "Subscriber hash",
      description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address or contact_id.",
    },
  },
  async run({ $ }) {
    const payload = {
      listId: this.listId,
      subscriberHash: this.subscriberHash,
    };
    return await this.mailchimp.deleteListMember($, payload);
  },
};
