import workamajig from "../../workamajig.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "workamajig-create-company",
  name: "Create a Company",
  description: "Starts the process of creating a new company in Workamajig",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    workamajig,
    companyDetails: {
      propDefinition: [
        workamajig,
        "companyDetails",
      ],
      description: "The details of the company to be created.",
    },
  },
  async run({ $ }) {
    const response = await this.workamajig.createCompany({
      companyDetails: this.companyDetails,
    });
    $.export("$summary", `Successfully created company with ID: ${response.id}`);
    return response;
  },
};
