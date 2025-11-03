import cufinder from "../../cufinder.app.mjs";

export default {
  key: "cufinder-find-company-email",
  name: "Find Company Email",
  description: "Finds a company's email using the domain. [See the documentation](https://apidoc.cufinder.io/apis/#company-email-finder-api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cufinder,
    domain: {
      propDefinition: [
        cufinder,
        "domain",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cufinder.findCompanyEmail({
      $,
      data: {
        companyDomain: this.domain,
      },
    });

    $.export("$summary", `Found company email(s) for domain ${this.domain}`);

    return response;
  },
};
