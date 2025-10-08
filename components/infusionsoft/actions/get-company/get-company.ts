import infusionsoft from "../../app/infusionsoft.app";
import { defineAction } from "@pipedream/types";
import { Company } from "../../types/responseSchemas";
import { GetObjectParams } from "../../types/requestParams";

export default defineAction({
  name: "Get Company",
  description:
    "Retrieve details of a Company [See docs here](https://developer.infusionsoft.com/docs/rest/#operation/getCompanyUsingGET)",
  key: "infusionsoft-get-company",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    infusionsoft,
    companyId: {
      propDefinition: [
        infusionsoft,
        "companyId",
      ],
    },
  },
  async run({ $ }): Promise<Company> {
    const params: GetObjectParams = {
      $,
      id: this.companyId,
    };
    const data: Company = await this.infusionsoft.getCompany(params);

    $.export(
      "$summary",
      `Retrieved Company "${data.company_name}" successfully`,
    );

    return data;
  },
});
