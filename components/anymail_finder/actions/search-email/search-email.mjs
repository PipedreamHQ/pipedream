import { ConfigurationError } from "@pipedream/platform";
import anymailFinder from "../../anymail_finder.app.mjs";

export default {
  key: "anymail_finder-search-email",
  name: "Search Email",
  description: "Searches for emails based on company information and, optionally, a person's name.",
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
      optional: true,
    },
    companyName: {
      propDefinition: [
        anymailFinder,
        "companyName",
      ],
      optional: true,
    },
    fullName: {
      type: "string",
      label: "Full Name",
      description: "The full name of the person to search.",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code (e.g. US) to target the company name conversion in.",
      optional: true,
    },
  },
  async run({ $ }) {

    if (!this.domain && !this.companyName) {
      throw new ConfigurationError("You must provide either a `domain` or a `company_name`");
    }

    const response = await this.anymailFinder.searchPersonEmail({
      $,
      data: {
        full_name: this.fullName,
        domain: this.domain,
        company_name: this.companyName,
        country_code: this.countryCode,
      },
    });

    $.export("$summary", `Successfully searched for emails related to ${this.domain || this.companyName} for ${this.fullName}`);
    return response;
  },
};
