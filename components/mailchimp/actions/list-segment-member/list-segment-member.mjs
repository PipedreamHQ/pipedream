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
      label: "List id",
      description: "The unique ID for the list.",
    },
    segmentId: {
      type: "string",
      label: "Segment id",
      description: "The unique id for the segment.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "A string list of fields to return. Reference parameters of sub-objects with dot notation.",
      optional: true,
    },
    excludeFields: {
      type: "string[]",
      label: "Exclude Fields",
      description: "A string list of fields to exclude_fields. Reference parameters of sub-objects with dot notation.",
    },
    count: {
      type: "integer",
      label: "Count",
      max: 10,
      min: 1,
      default: 10,
      description: "The number of records to return.",
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
    const response = await this.mailchimp.listSegmentMember($, payload);
    return response;
  },
};
