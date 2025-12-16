import app from "../../tomba.app.mjs";

export default {
  key: "tomba-find-phone",
  name: "Find Phone",
  description:
    "Search for phone numbers based on an email, domain, or LinkedIn URL. [See the documentation](https://docs.tomba.io/api/phone#phone-finder)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    searchType: {
      type: "string",
      label: "Search Type",
      description: "Choose the type of search to perform",
      options: [
        {
          label: "Search by Domain",
          value: "domain",
        },
        {
          label: "Search by Email",
          value: "email",
        },
        {
          label: "Search by LinkedIn URL",
          value: "linkedin",
        },
      ],
      default: "domain",
    },
    search: {
      type: "string",
      label: "Search Input",
      description: "Enter the domain, email address, or LinkedIn URL to search",
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.searchType === "domain") {
      params.domain = this.search;
    } else if (this.searchType === "email") {
      params.email = this.search;
    } else if (this.searchType === "linkedin") {
      params.linkedinUrl = this.search;
    }

    const response = await this.app.findPhone({
      $,
      ...params,
    });

    $.export(
      "$summary",
      `Successfully searched for phone numbers using ${this.searchType}: ${this.search}`,
    );
    return response;
  },
};
