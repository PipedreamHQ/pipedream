import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-remove-segment-member",
  name: "Remove Member From A Segment",
  description: "Removes a member from the specified static segment. [See docs here](https://mailchimp.com/developer/marketing/api/list-segment-members/remove-list-member-from-segment/)",
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
    segmentId: {
      propDefinition: [
        mailchimp,
        "segmentId",
        (c) => ({
          listId: c.listId,
        }),
      ],
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
      subscriberHash: this.subscriberHash,
      segmentId: this.segmentId,
      listId: this.listId,
    };
    const response = await this.mailchimp.removeSegmentMember($, payload);
    response && $.export("$summary", "Segment member removed successfully");
    return response;
  },
};
