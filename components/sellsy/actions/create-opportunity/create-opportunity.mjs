import sellsy from "../../sellsy.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "sellsy-create-opportunity",
  name: "Create Opportunity",
  description: "Forms a new opportunity in Sellsy. [See the documentation](https://api.sellsy.com/doc/v2/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    sellsy,
    opportunityName: sellsy.propDefinitions.opportunityName,
    value: sellsy.propDefinitions.value,
    expectedCloseDate: sellsy.propDefinitions.expectedCloseDate,
    companyName: {
      ...sellsy.propDefinitions.companyName,
      optional: true,
    },
  },
  async run({ $ }) {
    let companyName = this.companyName;
    if (companyName) {
      const company = await this.sellsy.findOrCreateCompany({
        companyName,
      });
      companyName = company.name;
    }
    const response = await this.sellsy.createOpportunity({
      opportunityName: this.opportunityName,
      value: this.value,
      expectedCloseDate: this.expectedCloseDate,
      companyName,
    });
    $.export("$summary", `Successfully created opportunity ${this.opportunityName}`);
    return response;
  },
};
