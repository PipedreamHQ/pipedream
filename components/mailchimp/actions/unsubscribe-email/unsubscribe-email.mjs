import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-unsubscribe-email",
  name: "Unsubscribe Email",
  description: "Unsubscribe an email address from an audience. [See docs here](https://mailchimp.com/developer/marketing/api/list-members/archive-list-member/)",
  version: "0.2.4",
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
