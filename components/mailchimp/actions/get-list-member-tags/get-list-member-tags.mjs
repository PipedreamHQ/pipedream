import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-list-member-tags",
  name: "Get List Member Tags",
  description: "Retrieves a list of all member tags. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-tags/list-member-tags/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List ID",
      description: "The unique id for the list.",
    },
    subscriberHash: {
      type: "string",
      label: "Subscriber hash",
      description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address or contact_id.",
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
    const payload = removeNullEntries({
      listId: this.listId,
      fields: this.fields.join(","),
      exclude_fields: this.excludeFields.join(","),
      action: this.action,
      subscriberHash: this.subscriberHash,
    });
    const response = await this.mailchimp.getListMemberTags($, payload);
    response?.tags?.length && $.export("$summary", "List member's tag found");
    return response;
  },
};
