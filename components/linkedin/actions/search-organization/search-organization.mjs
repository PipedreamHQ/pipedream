import linkedin from "../../linkedin.app.mjs";

export default {
  key: "linkedin-search-organization",
  name: "Search Organization",
  description: "Searches for an organization by vanity name or email domain. [See the docs here](https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/organizations/organization-lookup-api)",
  version: "0.1.11",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
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
    max: {
      propDefinition: [
        linkedin,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const count = 50;
    const results = [];

    const params = {
      start: 0,
      count,
    };
    const querystring = `${this.searchBy}&${this.searchBy}=${this.searchTerm}`;

    let done = false;
    do {
      const { elements } = await this.linkedin.searchOrganizations(querystring, {
        $,
        params,
      });
      results.push(...elements);
      params.start += count;
      if (elements?.length < count) {
        done = true;
      }
    } while (results.length < this.max && !done);

    $.export("$summary", "Successfully searched organizations");

    return results;
  },
};
