import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-search-company-signals",
  name: "Search Company Signals",
  description: "Search for company signals using identifiers like domain name or company name. This endpoint combines search and signal enrichment in a single request. [See the documentation](https://docs.lusha.com/apis/openapi/signals/searchcompanysignals)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    lusha,
    info: {
      type: "alert",
      alertType: "info",
      content: `Each company must have at least one identifier:\
        \n* Company ID\
        \n* Domain Name\
        \n* Company Domain
      `,
    },
    info2: {
      type: "alert",
      alertType: "info",
      content: `* Use \`startDate\` to customize the timeframe\
        \n* Companies are matched based on provided identifiers
      `,
    },
    companies: {
      type: "string[]",
      label: "Companies",
      description: "List of company objects to search for. Example: [{ \"id\": \"123321\", \"domain\": \"lusha.com\", \"name\": \"Lusha\" }]. [See the documentation](https://docs.lusha.com/apis/openapi/signals/searchcompanysignals) for more information.",
    },
    signals: {
      propDefinition: [
        lusha,
        "companySignals",
      ],
    },
    startDate: {
      propDefinition: [
        lusha,
        "startDate",
      ],
    },
  },
  async run({ $ }) {
    try {
      const response = await this.lusha.searchCompanySignals({
        $,
        params: {
          companies: parseObject(this.companies),
          signals: this.signals,
          startDate: this.startDate,
        },
      });
      $.export("$summary", "Successfully searched for company signals");

      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message);
    }
  },
};
