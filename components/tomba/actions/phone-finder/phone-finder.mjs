import app from "../../tomba.app.mjs";

export default {
  key: "tomba-phone-finder",
  name: "Phone Finder",
  description:
    "Search for phone numbers based on an email, domain, or LinkedIn URL. [See the documentation](https://tomba.io/api)",
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
      reloadProps: true,
      default: "domain",
    },
  },
  additionalProps() {
    const props = {};
    if (this.searchType === "domain") {
      props.domain = {
        type: "string",
        label: "Domain",
        description: "The domain name to search (e.g., stripe.com)",
      };
    } else if (this.searchType === "email") {
      props.email = {
        type: "string",
        label: "Email Address",
        description: "The email address to verify or search",
      };
    } else if (this.searchType === "linkedin") {
      props.linkedinUrl = {
        type: "string",
        label: "LinkedIn URL",
        description: "The LinkedIn profile URL",
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.app.phoneFinder({
      $,
      domain: this.domain,
      email: this.email,
      linkedinUrl: this.linkedinUrl,
    });

    const searchValue = this.domain || this.email || this.linkedinUrl;
    $.export(
      "$summary",
      `Successfully searched for phone numbers using ${this.searchType}: ${searchValue}`,
    );
    return response;
  },
};
