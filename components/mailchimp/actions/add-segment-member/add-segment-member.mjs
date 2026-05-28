import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-add-segment-member",
  name: "Add Member To Segment",
  description: "Adds a new member to a static segment. [See docs here](https://mailchimp.com/developer/marketing/api/list-segment-members/add-member-to-segment/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
      label: "Segment ID",
      description: "The unique ID of the segment",
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
    const response = await this.mailchimp.addSegmentMember($, payload);
    response && $.export("$summary", "Segment member added successfully");
    return response;
  },
};
