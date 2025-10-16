import whoisfreaks from "../../whoisfreaks.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "whoisfreaks-reverse-lookup",
  name: "Reverse Lookup",
  description: "Retrieve details about a domain by keyword, email, registrant name or company. [See the documentation](https://whoisfreaks.com/products/whois-api#reverse_lookup)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    whoisfreaks,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "Keyword search utilizes case-insensitive Pattern Matching search technique to search in our historical database. For example, `whoisfreaks` matches with any keyword that have the searched pattern like `mywhoisfreaks` and `whoisfreakscom`.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email search uses case-insensitive exact matching technique to search in our historical database. For example, `support@whoisfreaks.com` matches only with `support@whoisfreaks.com`.",
      optional: true,
    },
    owner: {
      type: "string",
      label: "Owner",
      description: "The owner name for requested whois",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Registrant name or Company search use full-text search technique to search in our historical database. For example, `whoisfreaks` matched with `whoisfreaks`, `whoisfreak`, `whois`, `mywhoisfreaks` and `whoisfreakscom`.",
      optional: true,
    },
    format: {
      propDefinition: [
        whoisfreaks,
        "format",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "For getting next or desired page of whois info. Default: `1`",
      default: 1,
      optional: true,
    },
  },
  async run({ $ }) {
    if ([
      this.keyword,
      this.email,
      this.owner,
      this.company,
    ].filter((v) => v !== undefined).length !== 1) {
      throw new ConfigurationError("Must enter one and only one of `keyword`, `email`, `owner`, or `company`");
    }

    const response = await this.whoisfreaks.domainLookup({
      $,
      params: {
        keyword: this.keyword,
        email: this.email,
        owner: this.owner,
        company: this.company,
        whois: "reverse",
        format: this.format,
        page: this.page,
      },
    });

    $.export("$summary", "Successfully performed reverse lookup");
    return response;
  },
};
