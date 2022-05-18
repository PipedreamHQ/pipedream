import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-list-member-tags",
  name: "Get List Members' Tags",
  description: "Retrieves a list of all member tags. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-tags/add-or-remove-member-tags/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      type: "string",
      label: "List id",
      description: "The unique id for the list.",
    },
    subscriberHash: {
      type: "string",
      label: "Subscriber hash",
      description: "The MD5 hash of the lowercase version of the list member's email address. This endpoint also accepts a list member's email address or contact_id.",
    },
    tags: {
      type: "string[]",
      label: "Fields",
      description: "Stringified object list of fields to return. name, or status properties allowed",
    },
  },
  async run({ $ }) {
    const payload = removeNullEntries({
      listId: this.listId,
      tags: this.tags,
      subscriberHash: this.subscriberHash,
    });
    return await this.mailchimp.addRemoveMemberTags($, payload);
  },
};
