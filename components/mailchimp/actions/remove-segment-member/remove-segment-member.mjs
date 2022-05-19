import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-remove-segment-member",
  name: "Remove A Member From A Segment",
  description: "Removes a member from the specified static segment. [See docs here](https://mailchimp.com/developer/marketing/api/list-segment-members/remove-list-member-from-segment/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List id",
      description: "The unique ID for the list.",
    },
    segmentId: {
      type: "string",
      label: "Segment id",
      description: "The unique id for the segment.",
    },
    subscriberHash: {
      type: "string",
      label: "Subscriber hash",
      description: "The MD5 hash of the lowercase version of the list member's email address.",
    },
  },
  async run({ $ }) {
    const payload = {
      subscriberHash: this.subscriberHash,
      segmentId: this.segmentId,
      listId: this.listId,
    };
    const response =  await this.mailchimp.removeSegmentMember($, payload);
    response && $.export("$summary", "Segment member removed");
    return response;
  },
};
