import lusha from "../../lusha.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "lusha-company-enrich",
  name: "Enrich Companies",
  description: "Enriches company information based on provided company IDs. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lusha,
    enrichCompanyRequestId: {
      propDefinition: [
        lusha,
        "enrichCompanyRequestId",
      ],
    },
    enrichCompanyIds: {
      propDefinition: [
        lusha,
        "enrichCompanyIds",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.lusha.enrichCompanies({
      enrichCompanyRequestId: this.enrichCompanyRequestId,
      enrichCompanyIds: this.enrichCompanyIds,
    });
    $.export("$summary", `Successfully enriched ${this.enrichCompanyIds.length} companies`);
    return response;
  },
};
