import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-unsubscribe-email",
  name: "Unsubscribe Email",
  description: "Unsubscribe an email address from an audience. [See docs here](https://mailchimp.com/developer/marketing/api/list-members/archive-list-member/)",
  version: "0.2.2",
  type: "action",
  props: {
    mailchimp,
    listId: {
      label: "List ID",
      type: "string",
      description: "The unique ID for the list.",
    },
    subscriberHash: {
      label: "Subscriber hash",
      type: "string",
      description: "The MD5 hash of the lowercase version of the list member's email address.",
    },
  },
  async run({ $ }) {
    const {
      listId,
      subscriberHash,
    } = this;
    return await this.mailchimp.archiveListMember($, {
      listId,
      subscriberHash,
    });

  },
};
