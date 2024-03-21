import beeboleApp from "../../beebole_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "beebole_app-create-company",
  name: "Create Company",
  description: "Creates a new company in Beebole. [See the documentation](https://beebole.com/help/api/#create-a-company)",
  version: `0.0.${new Date().getTime()}`,
  type: "action",
  props: {
    beeboleApp,
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
    const response = await this.beeboleApp.createCompany({
      companyName: this.companyName,
      companyCorporate: this.companyCorporate,
    });

    $.export("$summary", `Successfully created company with ID ${response.id}`);
    return response;
  },
};