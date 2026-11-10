import { ConfigurationError } from "@pipedream/platform";
import { MAX_ITEMS_PER_REQUEST } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-company-enrich",
  name: "Enrich Companies",
  description: "Reveal full company data (firmographics, industry, locations, technologies, funding and more) for companies found with **Search Companies**. Pass up to 100 company IDs from the search results. Billed per successful result. [See the documentation](https://docs.lusha.com/api-reference/enrich/enrich-companies)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lusha,
    companiesIds: {
      propDefinition: [
        lusha,
        "companyIds",
      ],
    },
  },
  async run({ $ }) {
    const ids = parseObject(this.companiesIds);
    if (!ids?.length || ids.length > MAX_ITEMS_PER_REQUEST) {
      throw new ConfigurationError(`Provide between 1 and ${MAX_ITEMS_PER_REQUEST} company IDs.`);
    }

    const response = await this.lusha.enrichCompanies({
      $,
      data: {
        ids,
      },
    });
    $.export("$summary", `Successfully enriched ${response.results?.length ?? 0} company(ies)`);
    return response;
  },
};
