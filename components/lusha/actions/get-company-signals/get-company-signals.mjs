import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-get-company-signals",
  name: "Get Company Signals By IDs",
  description: "Retrieve signals data for a list of company IDs. This endpoint allows you to get recent activities and signals for up to 100 companies per request. [See the documentation](https://docs.lusha.com/apis/openapi/signals/getcompanysignalsbyid)",
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
      content: "* Returns signals from the last 6 months by default\
        \n* Use `startDate` to customize the timeframe",
    },
    companyIds: {
      propDefinition: [
        lusha,
        "companyIds",
      ],
      description: "List of company IDs to retrieve signals for",
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
      const response = await this.lusha.getCompanySignalsById({
        $,
        params: {
          companyIds: parseObject(this.companyIds),
          signals: this.signals,
          startDate: this.startDate,
        },
      });
      $.export("$summary", "Successfully retrieved company signals");

      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message);
    }
  },
};
