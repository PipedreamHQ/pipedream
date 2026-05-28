import {
  commaSeparateArray, removeNullEntries,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-search-campaign",
  name: "Search Campaigns",
  description: "Searches for the campaigns. [See docs here](https://mailchimp.com/developer/marketing/api/search-campaigns/search-campaigns/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailchimp,
    query: {
      type: "string",
      label: "Query text",
      description: "Search query text used to filter results.",
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
  },
  async run({ $ }) {
    const payload = removeNullEntries({
      fields: commaSeparateArray(this.fields),
      exclude_fields: commaSeparateArray(this.excludeFields),
      query: this.query,
    });
    const response = await this.mailchimp.searchCampaign($, payload);
    response?.total_items && $.export("$summary", "Campaign found");
    return response;
  },
};
