import app from "../../tomba.app.mjs";

export default {
  key: "tomba-domain-search",
  name: "Domain Search",
  description:
    "Get every email address found on the internet using a given domain name, with sources. [See the documentation](https://tomba.io/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
    limitDomainSearch: {
      propDefinition: [
        app,
        "limitDomainSearch",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    department: {
      propDefinition: [
        app,
        "department",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.domainSearch({
      $,
      domain: this.domain,
      page: this.page,
      limit: this.limitDomainSearch,
      country: this.country,
      department: this.department,
    });

    $.export(
      "$summary",
      `Successfully found ${
        response.data?.emails?.length || 0
      } email addresses for domain: ${this.domain}`,
    );
    return response;
  },
};
