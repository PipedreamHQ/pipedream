import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-search-contact-signals",
  name: "Search Contact Signals",
  description: "Search for contact signals using identifiers like LinkedIn URL, email, or name + company. This endpoint combines search and signal enrichment in a single request. [See the documentation](https://docs.lusha.com/apis/openapi/signals/searchcontactsignals)",
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
        \n* Contacts are matched based on provided identifiers\
        \n* Returns both contact data and associated signals
      `,
    },
    contacts: {
      type: "string[]",
      label: "Contacts",
      description: "List of contact objects to search for. Example: [{ \"id\": \"123321\", \"social_links\": [\"https://www.linkedin.com/in/ron-nabet\"], \"full_name\": \"Ron Nabet\", \"email\": \"dustin@lusha.com\", \"companies\": [\"name\": \"Lusha\", \"domain\": \"lusha.com\", \"is_current\": true] }]. [See the documentation](https://docs.lusha.com/apis/openapi/signals/searchcontactsignals) for more information.",
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
      const response = await this.lusha.searchContactSignals({
        $,
        params: {
          contacts: parseObject(this.contacts),
          signals: this.signals,
          startDate: this.startDate,
        },
      });
      $.export("$summary", `Successfully searched for ${Object.keys(response.contacts).length} contact signals`);

      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response?.data?.message);
    }
  },
};
