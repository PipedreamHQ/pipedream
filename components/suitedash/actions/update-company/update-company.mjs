import suitedash from "../../suitedash.app.mjs";

export default {
  key: "suitedash-update-company",
  name: "Update Company",
  description: "Updates an existing company's details in SuiteDash",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    suitedash,
    companyId: {
      propDefinition: [
        suitedash,
        "companyId",
      ],
    },
    companyName: {
      propDefinition: [
        suitedash,
        "companyName",
      ],
      optional: true,
    },
    companyWebsite: {
      propDefinition: [
        suitedash,
        "companyWebsite",
      ],
      optional: true,
    },
    companyAddress: {
      propDefinition: [
        suitedash,
        "companyAddress",
      ],
      optional: true,
    },
    companyLogo: {
      propDefinition: [
        suitedash,
        "companyLogo",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const opts = {
      companyId: this.companyId,
      data: {
        companyName: this.companyName,
        companyWebsite: this.companyWebsite,
        companyAddress: this.companyAddress,
        companyLogo: this.companyLogo,
      },
    };
    const response = await this.suitedash.updateCompany(opts);
    $.export("$summary", `Successfully updated company ${this.companyId}`);
    return response;
  },
};
