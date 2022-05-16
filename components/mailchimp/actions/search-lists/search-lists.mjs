import { removeNullEntries } from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-search-lists",
  name: "Search Lists",
  description: "Searches for the lists. [See docs here](https://mailchimp.com/developer/marketing/api/lists/)",
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
    count: {
      type: "integer",
      label: "Count",
      max: 10,
      min: 1,
      default: 10,
      description: "The number of records to return.",
    },
    beforeDateCreated: {
      type: "string",
      label: "Before date created",
      description: "Restrict response to lists created before the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.",
      optional: true,
    },
    sinceDateCreated: {
      type: "string",
      label: "Since date created",
      description: "Restrict results to lists created after the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.",
      optional: true,
    },
    beforeCampaignLastSent: {
      type: "string",
      label: "Before campaign last sent",
      description: "Restrict results to lists created before the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.",
      optional: true,
    },
    sinceCampaignLastSent: {
      type: "string",
      label: "Since campaign last sent",
      description: "Restrict results to lists created after the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Restrict results to lists that include a specific subscriber's email address.",
      optional: true,
    },
    sortField: {
      type: "string",
      label: "Sort field",
      description: "Returns files sorted by the specified field. Possible value: \"date_created\"",
      optional: true,
    },
    sortDir: {
      type: "string",
      label: "Sort direction",
      description: "Determines the order direction for sorted results. Possible values: ASC or DESC.",
      optional: true,
      options: [
        "ASC",
        "DESC",
      ],
      default: "DESC",
    },
    hasEcommerceStore: {
      type: "boolean",
      label: "Has ecommerce store?",
      description: "The unique id for the list",
      optional: true,
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
      fields: this.fields.join(","),
      exclude_fields: this.excludeFields.join(","),
      count: this.count,
      offset: 0,
      before_date_created: this.beforeDateCreated,
      since_date_created: this.sinceDateCreated,
      before_campaign_last_sent: this.beforeCampaignLastSent,
      since_campaign_last_sent: this.sinceCampaignLastSent,
      email: this.email,
      sort_field: this.sortField,
      sort_dir: this.sortDir,
      has_ecommerce_store: this.hasEcommerceStore,
      include_total_contacts: this.includeTotalContacts,
    });
    const response = await this.mailchimp.searchLists($, payload);
    response?.lists?.length > 0 && $.export("$summary", "Campaign found");
    return response;
  },
};
