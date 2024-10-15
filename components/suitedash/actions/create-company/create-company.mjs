import suitedash from "../../suitedash.app.mjs";

export default {
  key: "suitedash-create-company",
  name: "Create Company",
  description: "Creates a new company in SuiteDash.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    suitedash,
    companyName: {
      propDefinition: [
        suitedash,
        "companyName",
      ],
    },
    companyRole: {
      propDefinition: [
        suitedash,
        "companyRole",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.suitedash.createCompany({
      data: {
        name: this.companyName,
        role: this.companyRole,
      },
    });
    $.export("$summary", `Successfully created company ${this.companyName}`);
    return response;
  },
};
