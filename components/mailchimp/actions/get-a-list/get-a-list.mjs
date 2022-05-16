import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-get-a-list",
  name: "Get a List",
  description: "Searches for lists. [See docs here](https://mailchimp.com/developer/marketing/api/lists/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
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
    listId: {
      type: "string",
      label: "List id",
      description: "The unique ID for the list.",
    },
    includeTotalContacts: {
      type: "boolean",
      label: "Include total contacts?",
      description: "Return the total_contacts field in the stats response, which contains an approximate count of all contacts in any state.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = removeNullEntries({
      listId: this.listId,
      fields: this.fields.join(","),
      exclude_fields: this.excludeFields.join(","),
      include_total_contacts: this.includeTotalContacts,
    });
    const response = await this.mailchimp.getList($, payload);
    response && $.export("$summary", "List found");
    return response;
  },
};
