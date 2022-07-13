import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { company } from "../../types/responseSchemas";
import { getCompanyParams } from "../../types/requestParams";

export default defineAction({
  name: "Get Company",
  description:
    "Retrieve details of a Company [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getCompanyUsingGET)",
  key: "infusionsoft-get-company",
  version: "0.0.1",
  type: "action",
  props: {
    infusionsoft,
    companyId: {
      propDefinition: [infusionsoft, "companyId"],
    },
  },
  async run({ $ }): Promise<company> {
    const params: getCompanyParams = {
      companyId: this.companyId,
    };
    const data: company = await this.infusionsoft.getCompany(params);

    $.export(
      "$summary",
      `Retrieved Company "${data.company_name}" successfully`
    );

    return data;
  },
});
