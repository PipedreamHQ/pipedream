// legacy_hash_id: a_74iE5o
import constants from "../../common/constants.mjs";
import {
  formatArrayStrings, removeNullEntries,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-add-subscriber-to-tag",
  name: "Add Subscriber to Tag",
  description: "Adds an email address to a tag within an audience.",
  version: "0.2.1",
  type: "action",
  props: {
    mailchimp,
    listId: {
      label: "List ID",
      type: "string",
      description: "The unique ID for the list.",
    },
    subscriberHash: {
      label: "Subscriber hash",
      type: "string",
      description: "The MD5 hash of the lowercase version of the list member's email address.",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: `Stringified object list of fields to return. name, or status (Possible status values: "inactive" or "active")  properties allowed.
        Example:
        \`{
            "name":"college",
            "status":"active",
        }\``,
    },
  },
  async run({ $ }) {

    const payload = removeNullEntries({
      listId: this.listId,
      subscriberHash: this.subscriberHash,
      tags: formatArrayStrings(this.tags, constants.ALLOWED_TAG_KEYS, "Tags"),
    });
    const response = await this.mailchimp.addRemoveMemberTags($, payload);
    response && $.export("$summary", "Action successful");
    return response;
  },
};
