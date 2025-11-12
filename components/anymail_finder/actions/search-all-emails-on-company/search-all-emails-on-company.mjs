import anymailFinder from "../../anymail_finder.app.mjs";

export default {
  key: "anymail_finder-search-all-emails-on-company",
  name: "Search All Emails on Company",
  description: "Searches for most popular emails based on company information. [See the documentation](https://anymailfinder.com/email-finder-api/docs#email_search_domain)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    anymailFinder,
    domain: {
      propDefinition: [
        anymailFinder,
        "domain",
      ],
    },
    companyName: {
      propDefinition: [
        anymailFinder,
        "companyName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.anymailFinder.searchPopularEmails({
      $,
      data: {
        domain: this.domain,
        company_name: this.companyName,
      },
    });
    $.export("$summary", `Successfully found ${response.results.total_count} popular emails on ${this.domain}`);
    return response;
  },
};
