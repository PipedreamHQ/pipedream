import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-search-contact-signals",
  name: "Search Contact Signals",
  description: "Search for contact signals using identifiers like LinkedIn URL, email, or name + company. This endpoint combines search and signal enrichment in a single request. [See the documentation](https://docs.lusha.com/tutorials/signals)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
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
      description: "List of contact objects to search for. Example: [{ \"id\": \"123321\", \"social_links\": [\"https://www.linkedin.com/in/ron-nabet\"], \"full_name\": \"Ron Nabet\", \"email\": \"dustin@lusha.com\", \"companies\": [\"name\": \"Lusha\", \"domain\": \"lusha.com\", \"is_current\": true] }]. [See the documentation](https://docs.lusha.com/tutorials/signals) for more information.",
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
    const response = await this.lusha.searchContactSignals({
      $,
      data: {
        contacts: parseObject(this.contacts),
        signals: this.signals,
        startDate: this.startDate,
      },
    });
    const count = Object.keys(response.contacts ?? {}).length;
    $.export("$summary", `Retrieved signals for ${count} contact${count === 1
      ? ""
      : "s"}`);
    return response;
  },
};
