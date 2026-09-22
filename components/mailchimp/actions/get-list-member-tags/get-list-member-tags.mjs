import {
  commaSeparateArray, removeNullEntries,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-list-member-tags",
  name: "Get List Member Tags",
  description: "Retrieves a list of all member tags. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-tags/list-member-tags/)",
  version: "0.0.3",
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
    subscriberHash: {
      propDefinition: [
        mailchimp,
        "subscriberHash",
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
    const payload = removeNullEntries({
      listId: this.listId,
      fields: commaSeparateArray(this.fields),
      exclude_fields: commaSeparateArray(this.excludeFields),
      action: this.action,
      subscriberHash: this.subscriberHash,
    });
    const response = await this.mailchimp.getListMemberTags($, payload);
    response?.tags?.length && $.export("$summary", "List member's tag found");
    return response;
  },
};
