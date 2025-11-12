import cufinder from "../../cufinder.app.mjs";

export default {
  key: "cufinder-find-company-website",
  name: "Find Company Website",
  description: "Finds a company's website using the company name. [See the documentation](https://apidoc.cufinder.io/apis/#company-website-finder-api)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cufinder,
    companyName: {
      propDefinition: [
        cufinder,
        "companyName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cufinder.findCompanyWebsite({
      $,
      data: {
        companyName: this.companyName,
      },
    });

    $.export("$summary", `Found website for company: ${this.companyName}`);

    return response;
  },
};
