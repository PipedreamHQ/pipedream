import anymailFinder from "../../anymail_finder.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "anymail_finder-search-all-emails-on-company",
  name: "Search All Emails on Company",
  description: "Searches for most popular emails based on company information. [See the documentation](https://api.anymailfinder.com/v5.0)",
  version: "0.0.{{ts}}",
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
      domain: this.domain,
      companyName: this.companyName,
    });
    $.export("$summary", `Successfully found ${response.results.emails.length} popular emails on ${this.domain}`);
    return response;
  },
};
