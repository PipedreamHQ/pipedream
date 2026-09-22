import {
  commaSeparateArray, removeNullEntries,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-list",
  name: "Get List",
  description: "Searches for lists. [See docs here](https://mailchimp.com/developer/marketing/api/lists/)",
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
    includeTotalContacts: {
      type: "boolean",
      label: "Include total contacts",
      description: "Return the total_contacts field in the stats response, which contains an approximate count of all contacts in any state.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = removeNullEntries({
      listId: this.listId,
      fields: commaSeparateArray(this.fields),
      exclude_fields: commaSeparateArray(this.excludeFields),
      include_total_contacts: this.includeTotalContacts,
    });
    const response = await this.mailchimp.getList($, payload);
    response && $.export("$summary", "List found");
    return response;
  },
};
