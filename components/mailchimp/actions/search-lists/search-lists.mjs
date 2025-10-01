import constants from "../../common/constants.mjs";
import {
  commaSeparateArray, removeNullEntries,
} from "../../common/utils.mjs";
import mailchimp from "../../mailchimp.app.mjs";

export default {
  key: "mailchimp-search-lists",
  name: "Search Lists",
  description: "Searches for lists. [See docs here](https://mailchimp.com/developer/marketing/api/lists/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailchimp,
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
      default: "date_created",
      optional: true,
    },
    sortDir: {
      type: "string",
      label: "Sort direction",
      description: "Determines the order direction for sorted results. Possible values: ASC or DESC.",
      optional: true,
      options: constants.SORT_DIRECTIONS,
      default: "DESC",
    },
    hasEcommerceStore: {
      type: "boolean",
      label: "Has ecommerce store?",
      description: "The unique ID for the list",
      optional: true,
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
      fields: commaSeparateArray(this.fields),
      exclude_fields: commaSeparateArray(this.excludeFields),
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
    response?.total_items && $.export("$summary", "List found");
    return response;
  },
};
