import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-subdomains-lookup",
  name: "Subdomains Lookup",
  description: "The Subdomain Lookup API is designed to retrieve subdomains related to the given domain name. It helps you explore subdomains that are available for registration or usage. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    domain: {
      type: "string",
      label: "Domain",
      description: "Domain name for availability and suggestions.",
      optional: false,
    },
    after: {
      type: "string",
      label: "After",
      description: "Filter subdomains seen after this date (format YYYY-MM-DD).",
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "Filter subdomains seen before this date( format YYYY-MM-DD).",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter subdomains by status (active or inactive).",
      optional: true,
      options: ["active","inactive"],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/subdomains/lookup",
      params: {
        domain: this.domain,
        after: this.after,
        before: this.before,
        status: this.status,
        page: this.page,
      },
    });
    $.export("$summary", "Successfully executed Subdomains Lookup");
    return response;
  },
};
