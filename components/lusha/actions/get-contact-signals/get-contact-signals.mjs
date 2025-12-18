import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-get-contact-signals",
  name: "Get Contact Signals By IDs",
  description: "Retrieve signals data for a list of contact IDs. This endpoint allows you to get recent activities and signals for up to 100 contacts per request. [See the documentation](https://docs.lusha.com/apis/openapi/signals/getcontactsignalsbyid)",
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
      content: `* Returns signals from the last 6 months by default\
        \n* Use \`startDate\` to customize the timeframe\
        \n* Each signal type requested counts towards credit usage
      `,
    },
    contactIds: {
      propDefinition: [
        lusha,
        "contactIds",
      ],
      description: "List of contact IDs to retrieve signals for",
    },
    signals: {
      propDefinition: [
        lusha,
        "signals",
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
      const response = await this.lusha.getContactSignalsById({
        $,
        params: {
          contactIds: parseObject(this.contactIds),
          signals: this.signals,
          startDate: this.startDate,
        },
      });
      $.export("$summary", `Successfully retrieved ${Object.keys(response.contacts).length} contact signals`);

      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message);
    }
  },
};
