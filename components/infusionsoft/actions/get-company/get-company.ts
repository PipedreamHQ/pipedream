import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Get Company",
  description: "Retrieve details of a Company [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getCompanyUsingGET)",
  key: "infusionsoft-get-company",
  version: "0.0.1",
  type: "action",
  props: {
    infusionsoft,
    companyId: {
      propDefinition: [
        infusionsoft,
        "companyId"
      ]
    }
  },
  async run({ $ }): Promise<object> {
    const company = await this.infusionsoft.getCompany({
      companyId: this.companyId
    });

    $.export("$summary", `Retrieved Company "${company.company_name}" successfully`);

    return company;
  },
});
