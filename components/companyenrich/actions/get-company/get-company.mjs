import companyenrich from "../../companyenrich.app.mjs";
import {
  companyId, companyExpansions,
} from "../../common/utils.mjs";

export default {
  key: "companyenrich-get-company",
  name: "Get Company",
  description: "Retrieve a company by its ID from **Search Companies** or **Autocomplete Companies**. Costs 1 credit when returned, plus selected paid expansions. [See the documentation](https://docs.companyenrich.com/reference/get_v2-companies-companyid)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    companyenrich,
    companyId: {
      propDefinition: [
        companyenrich,
        "companyId",
      ],
    },
    companyExpand: {
      propDefinition: [
        companyenrich,
        "companyExpand",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.companyenrich.getCompany({
      $,
      companyId: companyId(this.companyId),
      params: {
        expand: companyExpansions(this.companyExpand),
      },
    });
    $.export("$summary", `Retrieved company ${response.domain ?? response.id ?? "record"}`);
    return response;
  },
};
