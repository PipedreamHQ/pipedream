import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-linkedin-company-lookup",
  name: "Company LinkedIn Lookup",
  description: "Real-time LinkedIn company lookup. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/companies/linkedin_lookup)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    linkedinUrl: {
      type: "string",
      label: "LinkedIn URL",
      description: "Company LinkedIn URL to look up",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.linkedinCompanyLookup({
      $,
      data: {
        linkedin_url: this.linkedinUrl,
      },
    });
    $.export("$summary", `Successfully looked up LinkedIn company: ${this.linkedinUrl}`);
    return response;
  },
};
