import app from "../../clearbit.app.mjs";
import options from "../../common/options.mjs";

export default {
  key: "clearbit-find-contacts",
  name: "Find Contacts",
  description: "Find people who work at a specific company. [See the docs here](https://dashboard.clearbit.com/docs#prospector-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
      description: "Domain of the company you want to search against.",
    },
    title: {
      label: "Title",
      type: "string",
      description: "Job title to filter by",
      optional: true,
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
      description: "Email to filter by",
      optional: true,
    },
    role: {
      label: "Role",
      type: "string",
      description: "Employment Role.",
      optional: true,
    },
    seniority: {
      label: "Seniority",
      type: "string",
      description: "Employment Seniority",
      optional: true,
    },
    city: {
      label: "City",
      type: "string",
      description: "City to filter by.",
      optional: true,
    },
    state: {
      label: "State",
      type: "string",
      description: "State to filter by.",
      optional: true,
    },
    country: {
      label: "Country",
      type: "string",
      description: "Country to filter by.",
      optional: true,
    },
    name: {
      label: "Name",
      type: "string",
      description: "Name of an individual to filter by.",
      optional: true,
    },
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    suppression: {
      label: "Suppression",
      type: "string",
      description: "Set to eu to exclude records with country data in the EU. Set to eu_strict to exclude records with country data in the EU or with null country data.",
      optional: true,
      options: options.SUPPRESSION,
    },
  },
  async run({ $ }) {
    const params = {
      domain: this.domain,
      title: this.title,
      email: this.email,
      role: this.role,
      seniority: this.seniority,
      city: this.city,
      state: this.state,
      country: this.country,
      name: this.name,
      query: this.query,
      suppression: this.suppression,
    };
    const res = await this.app.paginate(
      $,
      this.maxResults || 100,
      this.app.findContacts,
      params,
    );
    $.export("$summary", `Found ${res.length} contact(s)`);
    return res;
  },
};
