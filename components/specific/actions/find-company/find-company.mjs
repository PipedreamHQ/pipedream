import specific from "../../specific.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "specific-find-company",
  name: "Find Company",
  description: "Retrieve details of a specified company. [See the documentation](https://public-api.specific.app/docs/introduction/welcome)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    specific,
    companyId: {
      propDefinition: [
        specific,
        "companyId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.specific.retrieveCompanyDetails({
      companyId: this.companyId,
    });
    $.export("$summary", `Successfully retrieved details for company ID: ${this.companyId}`);
    return response;
  },
};
