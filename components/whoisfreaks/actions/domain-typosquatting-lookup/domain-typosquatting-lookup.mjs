import whoisfreaks from "../../whoisfreaks.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "whoisfreaks-domain-typosquatting-lookup",
  name: "Domain Typosquatting Lookup",
  description: "Find registered domains that look like typo variants of a brand keyword or wildcard pattern, across 7,800+ TLDs. Each result includes the domain name, registration, expiry and last-seen dates, and drop status. Use this for brand protection and phishing detection. Provide exactly one of keyword or pattern. Results are paginated 100 domains per page. [See the documentation](https://whoisfreaks.com/documentation/domain-typosquats-api)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    whoisfreaks,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Brand or label to find typo variants for (e.g. `google`). 3-63 characters, letters, digits or hyphens, no dots. Use either keyword or pattern, not both.",
      optional: true,
    },
    pattern: {
      type: "string",
      label: "Pattern",
      description: "Wildcard search string with fuzzy matching (e.g. `*paypal*`). At least 5 characters besides `*`, at most 63 characters and 3 asterisks. Use either keyword or pattern, not both.",
      optional: true,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "The `nextPageToken` value from a previous response, to retrieve the next page. Pass the same keyword or pattern as the original request.",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.keyword && !this.pattern) || (this.keyword && this.pattern)) {
      throw new ConfigurationError("Please provide exactly one of `Keyword` or `Pattern`.");
    }

    const response = await this.whoisfreaks.lookupDomainTyposquatting({
      $,
      params: {
        keyword: this.keyword,
        pattern: this.pattern,
        pageToken: this.pageToken,
      },
    });
    $.export("$summary", `Successfully retrieved typosquatting domains for ${this.keyword || this.pattern}`);
    return response;
  },
};
