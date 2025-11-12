import app from "../../contactout.app.mjs";

export default {
  key: "contactout-decision-makers-search",
  name: "Decision Makers Search",
  description: "Get profiles of key decision makers within a specified company. [See the documentation](https://api.contactout.com/#decision-makers-api).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    linkedinUrl: {
      type: "string",
      label: "LinkedIn Company URL",
      description: "The fully formed URL of the company's LinkedIn profile (e.g., `https://linkedin.com/company/contactout`)",
      optional: true,
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
      description: "The domain name of the company's website (e.g., example.com)",
      optional: true,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "The name of the company",
      optional: true,
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    revealInfo: {
      propDefinition: [
        app,
        "revealInfo",
      ],
    },
  },
  async run({ $ }) {
    const {
      linkedinUrl,
      domain,
      name,
      page,
      revealInfo,
    } = this;

    const response = await this.app.searchDecisionMakers({
      $,
      params: {
        linkedin_url: linkedinUrl,
        domain,
        name,
        page,
        reveal_info: revealInfo,
      },
    });

    $.export("$summary", "Successfully searched for decision makers");
    return response;
  },
};
