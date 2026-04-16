import enrichlayer from "../../enrich_layer.app.mjs";

export default {
  key: "enrich_layer-get-person-lookup",
  name: "Get Person Lookup",
  description: "Look up a person with a name and company information to find their professional network profile. Cost: 2 credits per successful request. [See the documentation](https://enrichlayer.com/docs/api/v2/people-api/person-lookup).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    enrichlayer,
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the person to look up.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the person to look up.",
      optional: true,
    },
    companyDomain: {
      propDefinition: [
        enrichlayer,
        "companyDomain",
      ],
      description: "Company name or domain (e.g., `gatesfoundation.org`).",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title that the person holds at their current job.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "Location of the person (country, city, or state name).",
      optional: true,
    },
    similarityChecks: {
      type: "string",
      label: "Similarity Checks",
      description: "Controls whether the API performs similarity comparisons to eliminate false positives. Credits are still deducted if `include` returns null.",
      optional: true,
      options: [
        {
          label: "Include (default)",
          value: "include",
        },
        {
          label: "Skip (no charge if no results)",
          value: "skip",
        },
      ],
    },
    enrichProfile: {
      propDefinition: [
        enrichlayer,
        "enrichProfile",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.enrichlayer.getPersonLookup({
      $,
      params: {
        first_name: this.firstName,
        last_name: this.lastName,
        company_domain: this.companyDomain,
        title: this.title,
        location: this.location,
        similarity_checks: this.similarityChecks,
        enrich_profile: this.enrichProfile,
      },
    });
    $.export("$summary", `Successfully looked up person: ${this.firstName}${this.lastName
      ? ` ${this.lastName}`
      : ""}`);
    return response;
  },
};
