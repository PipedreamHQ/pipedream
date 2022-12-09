import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-search-organization",
  name: "Search Organization",
  description: "Searches for an organization by vanity name or email domain. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-lookup-api)",
  version: "0.1.2",
  type: "action",
  props: {
    linkedin,
    searchBy: {
      type: "string",
      label: "Search By",
      description: "You can look up the `id`, `name`, `localizedName`, `vanityName`, `localizedWebsite`, `logoV2`, and `location` of any organization using `vanityName` or `emailDomain`",
      options: [
        "vanityName",
        "emailDomain",
      ],
    },
    searchTerm: {
      type: "string",
      label: "Search Term",
      description: "Keyword to search for",
    },
    start: {
      type: "string",
      label: "Start",
      description: "The index of the first item you want results for.",
      optional: true,
    },
    count: {
      type: "string",
      label: "Count",
      description: "The number of items you want included on each page of results. Note that there may be less remaining items than the value you specify here.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      start: this.start,
      count: this.count,
    };
    const querystring = `${this.search_by}&${this.search_by}=${this.search_term}`;

    const response = await this.linkedin.searchOrganizations({
      $,
      querystring,
      params,
    });

    $.export("$summary", "Successfully searched organizations");

    return response;
  },
};
