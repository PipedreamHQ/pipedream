// legacy_hash_id: a_WYiedE
import { axios } from "@pipedream/platform";

export default {
  key: "mailchimp-find-member",
  name: "Search Members/Subscribers",
  description: "Searches for a subscriber. The search can be restricted to a specific list, or can be used to search across all lists in an account.",
  version: "0.2.1",
  type: "action",
  props: {
    mailchimp: {
      type: "app",
      app: "mailchimp",
    },
    fields: {
      type: "any",
      description: "A comma-separated list of fields to return.",
      optional: true,
    },
    exclude_fields: {
      type: "any",
      description: "A comma-separated list of fields to exclude.",
      optional: true,
    },
    query: {
      type: "string",
      description: "The search query used to filter results.",
    },
    list_id: {
      type: "string",
      description: "The unique id for the list.",
      optional: true,
    },
  },
  async run({ $ }) {
    const mailchimpParams = [
      "fields",
      "exclude_fields",
      "query",
      "list_id",
    ];
    let p = this;

    const queryString = mailchimpParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    return await axios($, {
      url: `https://${this.mailchimp.$auth.dc}.api.mailchimp.com/3.0/search-members?${queryString}`,
      headers: {
        Authorization: `Bearer ${this.mailchimp.$auth.oauth_access_token}`,
      },
    });
  },
};
