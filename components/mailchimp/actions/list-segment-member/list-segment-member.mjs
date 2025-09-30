import { commaSeparateArray } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-list-segment-member",
  name: "List Segment Members",
  description: "Retrieves a list of all segment members. [See docs here](https://mailchimp.com/developer/marketing/api/list-segment-members/list-members-in-segment/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
        "count",
      ],
    },
  },
  async run({ $ }) {
    const payload = {
      fields: commaSeparateArray(this.fields),
      exclude_fields: commaSeparateArray(this.excludeFields),
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
