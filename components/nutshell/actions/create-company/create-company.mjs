import nutshell from "../../nutshell.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "nutshell-create-company",
  name: "Create Company",
  description: "Creates a new company within Nutshell. [See the documentation](https://developers.nutshell.com)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    nutshell,
    companyName: nutshell.propDefinitions.companyName,
    industry: {
      ...nutshell.propDefinitions.industry,
      optional: true,
    },
    numberOfEmployees: {
      ...nutshell.propDefinitions.numberOfEmployees,
      optional: true,
    },
    location: {
      ...nutshell.propDefinitions.location,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.nutshell.createCompany({
      companyName: this.companyName,
      industry: this.industry,
      numberOfEmployees: this.numberOfEmployees,
      location: this.location,
    });
    $.export("$summary", `Successfully created company with name ${this.companyName}`);
    return response;
  },
};
