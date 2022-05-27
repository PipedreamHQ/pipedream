import { axios } from "@pipedream/platform";

export default {
  key: "rocketreach-lookup-company",
  name: "lookup company",
  description: "Lookup the profile of a company",
  version: "0.0.1",
  type: "action",
  props: {
    rocketreach: {
      type: "app",
      app: "rocketreach",
    },
    name: {
      type: "string",
      description: "Company's name",
      optional: true,
    },
    domain: {
      type: "string",
      description: "Company's Domain",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      description: "Company's LinkedIn URL",
      optional: true,
    },
  },
  async run({ $ }) {

    if (!this.name && !this.domain && !this.linkedinUrl) {
      throw new Error("This action requires one or more of the following: name, domain, linkedIn URL. Please enter at least one of them above.");
    }

    const response = await axios($, {
      url: "https://api.rocketreach.co/v2/api/lookupCompany",
      method: "GET",
      params: {
        api_key: `${this.rocketreach.$auth.api_key}`,
        name: this.name,
        domain: this.domain,
        linkedin_url: this.linkedinUrl,
      },
    });

    $.export("$summary", `Successfully found "${response.name}"`);
    return response;
  },
};
