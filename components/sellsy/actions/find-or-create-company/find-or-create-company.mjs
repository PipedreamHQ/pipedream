import sellsy from "../../sellsy.app.mjs";

export default {
  key: "sellsy-find-or-create-company",
  name: "Find Or Create Company",
  description: "Checks to see if a company exists in Sellsy and creates it if it doesn't. [See the documentation](https://api.sellsy.com/doc/v2/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sellsy,
    companyName: {
      type: "string",
      label: "Company Name",
      description: "Name of the company",
      required: true,
    },
    companyEmail: {
      type: "string",
      label: "Company Email",
      description: "Email of the company",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sellsy.findOrCreateCompany({
      companyName: this.companyName,
      companyEmail: this.companyEmail,
    });
    $.export("$summary", `Successfully found or created company ${this.companyName}`);
    return response;
  },
};
