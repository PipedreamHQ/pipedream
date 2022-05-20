import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-list-segment-member",
  name: "List Segment Members",
  description: "Retrieves a list of all segment members. [See docs here](https://mailchimp.com/developer/marketing/api/list-segment-members/list-members-in-segment/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List ID",
      description: "The unique ID for the list.",
    },
    segmentId: {
      type: "string",
      label: "Segment ID",
      description: "The unique ID for the segment.",
    },
    fields: {
      propDefinition: [
        mailchimp,
        "fields",
      ],
    },
    excludeFields: {
      propDefinition: [
        mailchimp,
        "excludeFields",
      ],
    },
    count: {
      propDefinition: [
        mailchimp,
        "excludeFields",
      ],
    },
  },
  async run({ $ }) {
    const payload = {
      fields: this.fields.join(","),
      exclude_fields: this.excludeFields.join(","),
      count: this.count,
      offset: 0,
      segmentId: this.segmentId,
      listId: this.listId,
    };
    const response = await this.mailchimp.listSegmentMembers($, payload);
    response && $.export("$summary", "List segment members found");
    return response;
  },
};
