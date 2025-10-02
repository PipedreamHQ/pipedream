import rocketreachApp from "../../rocketreach.app.mjs";

export default {
  key: "rocketreach-lookup-company",
  name: "lookup company",
  description: "Lookup the profile of a company. [See docs here](https://rocketreach.co/api?section=api_section_ws_lookupCompany)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    rocketreachApp,
    domain: {
      label: "Domain",
      type: "string",
      description: "Company's Domain",
      optional: true,
    },
    name: {
      label: "Name",
      type: "string",
      propDefinition: [
        rocketreachApp,
        "name",
      ],
      description: "Company's name",
    },
    linkedinUrl: {
      label: "LinkedIn URL",
      type: "string",
      propDefinition: [
        rocketreachApp,
        "linkedinUrl",
      ],
    },
  },
  async run({ $ }) {

    if (!this.name && !this.domain && !this.linkedinUrl) {
      throw new Error("This action requires one or more of the following: Name, Domain, LinkedIn URL. Please enter at least one of them above.");
    }
    const params = {
      name: this.name,
      domain: this.domain,
      linkedin_url: this.linkedinUrl,
    };
    const response = await this.rocketreachApp.lookupCompany(params, $);

    $.export("$summary", `Successfully found "${response.name}"`);
    return response;
  },
};
