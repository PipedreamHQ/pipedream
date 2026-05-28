import { commaSeparateArray } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-search-member",
  name: "Search Members/Subscribers",
  description: `Searches for a subscriber. The search can be restricted to a specific list, or can be used to search across all lists in an account.
   [See docs here](https://mailchimp.com/developer/marketing/api/search-members/)
  `,
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailchimp,
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
    query: {
      label: "Query",
      type: "string",
      description: "The search query used to filter results. Query should be a valid email, or a string representing a contact's first or last name.",
    },
    listId: {
      label: "List ID",
      type: "string",
      description: "The unique ID for the list.",
      optional: true,
    },
  },
  async run({ $ }) {
    const payload = {
      list_id: this.listId,
      query: this.query,
      exclude_fields: commaSeparateArray(this.excludeFields),
      fields: commaSeparateArray(this.fields),
    };

    return await this.mailchimp.searchMembers($, payload);
  },
};
