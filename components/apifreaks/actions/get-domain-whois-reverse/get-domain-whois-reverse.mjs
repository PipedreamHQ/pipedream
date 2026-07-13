import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-domain-whois-reverse",
  name: "Reverse WHOIS Lookup",
  description: "Performs a reverse WHOIS search using one or more search parameters like keyword, email, owner, or company. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Keyword search term for reverse WHOIS by keyword (case-insensitive pattern matching).",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email search term for reverse WHOIS by email address (case-insensitive exact or regex match; * wildcard supported).",
      optional: true,
    },
    owner: {
      type: "string",
      label: "Owner",
      description: "Registrant or owner name for reverse WHOIS (a full-text search phrase matching technique to retrieve results).",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Organization or company name for reverse WHOIS (full-text search phrase matching technique to retrieve results).",
      optional: true,
    },
    exact: {
      type: "string",
      label: "Exact",
      description: "Accepts 'true' or 'false'. \"true\" returns only records that exactly match the input (keyword, owner/registrant, or company). \"false\" returns all matches and is the default when omitted.",
      optional: true,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "\"default\" for Complete WHOIS data and \"mini\" for Only important fields of each matching domain.",
      optional: true,
      options: ["default","mini"],
    },
    page: {
      type: "string",
      label: "Page",
      description: "Page number for paginated results.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/domain/whois/reverse",
      params: {
        keyword: this.keyword,
        email: this.email,
        owner: this.owner,
        company: this.company,
        exact: this.exact,
        mode: this.mode,
        page: this.page,
      },
    });
    $.export("$summary", "Successfully executed Reverse WHOIS Lookup");
    return response;
  },
};
