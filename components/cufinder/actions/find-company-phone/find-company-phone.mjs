import cufinder from "../../cufinder.app.mjs";

export default {
  key: "cufinder-find-company-phone",
  name: "Find Company Phone",
  description: "Find a company phone using the domain. [See the documentation](https://apidoc.cufinder.io/apis/#company-phone-finder-api)",
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
    const response = await this.cufinder.findCompanyPhone({
      data: {
        companyDomain: this.domain,
      },
    });

    $.export("$summary", `Successfully found phone numbers for the domain: ${this.domain}`);

    return response;
  },
};
