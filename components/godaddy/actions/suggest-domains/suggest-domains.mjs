import godaddy from "../../godaddy.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "godaddy-suggest-domains",
  name: "Suggest Domains",
  description: "Suggest domains based on the given criteria. [See the documentation](https://developer.godaddy.com/doc/endpoint/domains#/v1/suggest)",
  version: "0.0.1",
  type: "action",
  props: {
    godaddy,
    query: {
      type: "string",
      label: "Query",
      description: "Domain name or set of keywords for which alternative domain names will be suggested",
    },
    country: {
      type: "string",
      label: "Country",
      description: "Two-letter ISO country code to be used as a hint for target region",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Name of city to be used as a hint for target region",
      optional: true,
    },
    sources: {
      type: "string[]",
      label: "Sources",
      description: "Sources to be queried",
      options: constants.DOMAIN_SUGGESTION_SOURCES,
      optional: true,
    },
    tlds: {
      propDefinition: [
        godaddy,
        "tlds",
      ],
    },
    lengthMax: {
      type: "integer",
      label: "Length Max",
      description: "Maximum length of second-level domain",
      optional: true,
    },
    lengthMin: {
      type: "integer",
      label: "Length Min",
      description: "Minimum length of second-level domain",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of suggestions to return",
      optional: true,
    },
    waitMs: {
      type: "integer",
      label: "Wait Ms",
      description: "Maximum amount of time, in milliseconds, to wait for responses. If elapses, return the results compiled up to that point",
      optional: true,
    },
  },
  async run({ $ }) {
    const domains = await this.godaddy.suggestDomains({
      $,
      params: {
        query: this.query,
        country: this.country,
        city: this.city,
        sources: this.sources,
        tlds: this.tlds,
        lengthMax: this.lengthMax,
        lengthMin: this.lengthMin,
        limit: this.limit,
        waitMs: this.waitMs,
      },
    });

    $.export("$summary", `Found ${domains.length} domain(s)`);
    return domains;
  },
};
