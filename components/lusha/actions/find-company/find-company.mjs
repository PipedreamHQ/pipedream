import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-find-company",
  name: "Find Company",
  description: "Search for a company. [See docs here](https://www.lusha.com/docs/#company-api)",
  version: "0.0.1",
  type: "action",
  props: {
    lusha,
    companyName: {
      label: "Company Name",
      description: "The name of the company",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = this.lusha.findCompany({
      $,
      params: {
        company: this.companyName,
      },
    });

    $.export("$summary", "Successfully searched company");

    return response;
  },
};
