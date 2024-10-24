import gainsight_nxt from "../../gainsight_nxt.app.mjs";

export default {
  key: "gainsight_nxt-create-or-update-company",
  name: "Create or Update Company",
  description: "Creates or updates a company record in Gainsight NXT. [See the documentation]().",
  version: "0.0.{ts}",
  type: "action",
  props: {
    gainsight_nxt,
    companyFields: {
      propDefinition: [
        gainsight_nxt,
        "companyFields",
      ],
    },
  },
  async run({ $ }) {
    // Combine companyFields array into a single object
    const companyData = this.companyFields.reduce((acc, fieldStr) => {
      const fieldObj = JSON.parse(fieldStr);
      return {
        ...acc,
        ...fieldObj,
      };
    }, {});

    // Create or update the company
    const result = await this.gainsight_nxt.createOrUpdateCompany(companyData);

    // Export summary
    $.export(
      "$summary",
      `Created or updated company '${result.name}' with ID ${result.id}`,
    );

    return result;
  },
};
