// legacy_hash_id: a_YEiw3x
import { axios } from "@pipedream/platform";

export default {
  key: "clearbit-find-contact",
  name: "Find Contact",
  description: "Find people who work at a specific company.",
  version: "0.1.1",
  type: "action",
  props: {
    clearbit: {
      type: "app",
      app: "clearbit",
    },
    domain: {
      type: "string",
      description: "Domain of the company you want to search against.",
    },
    title: {
      type: "string",
      description: "Job title to filter by",
      optional: true,
    },
    email: {
      type: "string",
      description: "Email to filter by",
      optional: true,
    },
    role: {
      type: "string",
      description: "Employment Role.",
      optional: true,
    },
    seniority: {
      type: "string",
      description: "Employment Seniority",
      optional: true,
    },
    city: {
      type: "string",
      description: "City to filter by.",
      optional: true,
    },
    state: {
      type: "string",
      description: "State to filter by.",
      optional: true,
    },
    country: {
      type: "string",
      description: "Country to filter by.",
      optional: true,
    },
    name: {
      type: "string",
      description: "Name of an individual to filter by.",
      optional: true,
    },
    query: {
      type: "string",
      description: "Search query string.",
      optional: true,
    },
    page: {
      type: "string",
      description: "Which results page to show (default is 1).",
      optional: true,
    },
    page_size: {
      type: "string",
      optional: true,
    },
    suppression: {
      type: "string",
      description: "Set to eu to exclude records with country data in the EU. Set to eu_strict to exclude records with country data in the EU or with null country data.",
      optional: true,
      options: [
        "eu ",
        "eu_strict ",
      ],
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://prospector.clearbit.com/v1/people/search?domain=${this.domain}&title=${this.title}&email=${this.email}&role=${this.role}&seniority=${this.seniority}&city=${this.city}&state=${this.state}&country=${this.country}&name=${this.name}&query=${this.query}&page=${this.page}&page_size=${this.page_size}&suppression=${this.suppression}`,
      headers: {
        Authorization: `Bearer ${this.clearbit.$auth.api_key}`,
      },
    });
  },
};
