import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-add-segment-member",
  name: "Add a Member to a Segment",
  description: "Adds a new member to a static segment. [See docs here](https://mailchimp.com/developer/marketing/api/list-segment-members/add-member-to-segment/)",
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
    emailAddress: {
      type: "string",
      label: "Email address",
      description: "Email address for a subscriber.",
    },
  },
  async run({ $ }) {
    const payload = {
      email_address: this.emailAddress,
      segmentId: this.segmentId,
      listId: this.listId,
    };
    const response =  await this.mailchimp.addSegmentMember($, payload);
    // response && $.export("$summary", "Segment member added");
    console.log(response);
    return response;
  },
};
