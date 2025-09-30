import constants from "../../common/constants.mjs";
import {
  formatArrayStrings, removeNullEntries,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-add-subscriber-to-tag",
  name: "Add Subscriber To Tag",
  description: "Adds an email address to a tag within an audience. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-tags/add-or-remove-member-tags/)",
  version: "0.2.3",
  annotations: {
    destructiveHint: true,
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
    subscriberHash: {
      propDefinition: [
        mailchimp,
        "subscriberHash",
        (c) => ({
          listId: c.listId,
        }),
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: `Stringified object list of fields to return. name, or status (Possible status values: "inactive" or "active") properties allowed.
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
      tags: formatArrayStrings(this.tags, constants.ALLOWED_TAG_KEYS, "Tags", {
        status: [
          "active",
          "inactive",
        ],
      }),
    });
    await this.mailchimp.addRemoveListMemberTags($, payload);
    $.export("$summary", "Action successful");
  },
};
