// legacy_hash_id: a_A6iPqL
import { axios } from "@pipedream/platform";

export default {
  key: "linkedin-search-organization",
  name: "Search Organization",
  description: "Searches for an organization by vanity name or email domain.",
  version: "0.1.1",
  type: "action",
  props: {
    linkedin: {
      type: "app",
      app: "linkedin",
    },
    search_by: {
      type: "string",
      description: "You can look up the `id`, `name`, `localizedName`, `vanityName`, `localizedWebsite`, `logoV2`, and `location` of any organization using `vanityName` or `emailDomain`",
      options: [
        "vanityName",
        "emailDomain",
      ],
    },
    search_term: {
      type: "string",
    },
    start: {
      type: "string",
      optional: true,
    },
    count: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
  //See the API docs here: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-lookup-api

    if (!this.search_by || !this.search_term) {
      throw new Error("Must provide search_by and search_term parameters.");
    }

    return await axios($, {
      url: `https://api.linkedin.com/v2/organizations?q=${this.search_by}&${this.search_by}=${this.search_term}`,
      headers: {
        Authorization: `Bearer ${this.linkedin.$auth.oauth_access_token}`,
      },
      params: {
        start: this.start,
        count: this.count,
      },
    });
  },
};
