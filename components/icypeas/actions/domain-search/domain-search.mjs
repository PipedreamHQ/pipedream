import icypeas from "../../icypeas.app.mjs";

export default {
  key: "icypeas-domain-search",
  name: "Domain or Company Search",
  description: "Performs a search using a domain or company name as input. [See the documentation](https://api-doc.icypeas.com/find-emails/single-search/domain-scan)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    icypeas,
    domainOrCompany: {
      propDefinition: [
        icypeas,
        "domainOrCompany",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.icypeas.domainSearch({
      $,
      data: {
        domainOrCompany: this.domainOrCompany,
      },
    });
    $.export("$summary", `Search completed for ${this.domainOrCompany}`);
    return response;
  },
};
