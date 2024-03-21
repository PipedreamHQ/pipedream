import beeboleApp from "../../beebole_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "beebole_app-update-company",
  name: "Update a Company",
  description: "Updates a company's details in Beebole. [See the documentation](https://beebole.com/help/api/#update-a-company)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    beeboleApp,
    companyId: {
      propDefinition: [
        beeboleApp,
        "companyId"
      ]
    },
    companyName: {
      propDefinition: [
        beeboleApp,
        "companyName"
      ]
    },
    companyCorporate: {
      propDefinition: [
        beeboleApp,
        "companyCorporate"
      ]
    },
  },
  async run({ $ }) {
    const response = await this.beeboleApp.updateCompany({
      companyId: this.companyId,
      companyName: this.companyName,
      companyCorporate: this.companyCorporate,
    });

    $.export("$summary", `Updated company ${this.companyName} successfully`);
    return response;
  },
};