import app from "../../clearbit.app.mjs";
import options from "../../common/options.mjs";

export default {
  key: "clearbit-find-contact",
  name: "Find Contact",
  description: "Find people who work at a specific company.",
  version: "0.1.1",
  type: "action",
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "webhookUrl",
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
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    pageSize: {
      propDefinition: [
        app,
        "pageSize",
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
    /* return await axios($, {
      url: `https://prospector.clearbit.com/v1/people/search?domain=${this.domain}&title=${this.title}&email=${this.email}&role=${this.role}&seniority=${this.seniority}&city=${this.city}&state=${this.state}&country=${this.country}&name=${this.name}&query=${this.query}&page=${this.page}&page_size=${this.page_size}&suppression=${this.suppression}`,
      headers: {
        Authorization: `Bearer ${this.clearbit.$auth.api_key}`,
      },
    }); */
    return $;
  },
};
