import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-search-campaign",
  name: "Search Campaigns",
  description: "Searches for the campaigns. [See docs here](https://mailchimp.com/developer/marketing/api/search-campaigns/search-campaigns/)",
  version: "0.0.1",
  type: "action",
  props: {
    mailchimp,
    query: {
      type: "string",
      label: "Query text",
      description: "Search query text used to filter results.",
    },
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
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fields,
      excludeFields,
      query,
    } = this;
    const payload = removeNullEntries({
      fields: fields.join(","),
      exclude_fields: excludeFields.join(","),
      query,
    });
    const response = await this.mailchimp.searchCampaign($, payload);
    response?.results?.length && $.export("$summary", "Result found");
    return response;
  },
};
