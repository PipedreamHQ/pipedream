import constants from "../../common/constants.mjs";
import {
  formatArrayStrings, removeNullEntries,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-add-remove-member-tags",
  name: "Add Or Remove Members Tags",
  description: "Add or remove member tags. [See docs here](https://mailchimp.com/developer/marketing/api/list-member-tags/add-or-remove-member-tags/)",
  version: "0.0.2",
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
      description: `Stringified object list of tags assigned to the list member.. name, or status (Possible status values: "inactive" or "active") properties allowed.
        Example:
        \`{
            "name":"",
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
    const response = await this.mailchimp.addRemoveListMemberTags($, payload);
    response && $.export("$summary", "Successful");
    return response;
  },
};
