import { ConfigurationError } from "@pipedream/platform";
import {
  CONTACT_REVEAL_OPTIONS,
  MAX_ITEMS_PER_REQUEST,
} from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import lusha from "../../lusha.app.mjs";

export default {
  key: "lusha-contact-enrich",
  name: "Enrich Contacts",
  description: "Reveal full contact data (emails and phones) for contacts found with **Search Contacts**. Pass up to 100 contact IDs from the search results. Each revealed field is billed per contact. If Data Waterfall is enabled on your Lusha account, the response can include a `job` object: the results returned are what is already known, and the remaining data is delivered asynchronously. [See the documentation](https://docs.lusha.com/api-reference/enrich/enrich-contacts)",
  version: "0.1.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    lusha,
    contactIds: {
      propDefinition: [
        lusha,
        "contactIds",
      ],
    },
    reveal: {
      type: "string[]",
      label: "Reveal",
      description: "Which data to reveal. Leave empty to reveal both emails and phones.",
      options: CONTACT_REVEAL_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const ids = parseObject(this.contactIds);
    if (!ids?.length || ids.length > MAX_ITEMS_PER_REQUEST) {
      throw new ConfigurationError(`Provide between 1 and ${MAX_ITEMS_PER_REQUEST} contact IDs.`);
    }

    const response = await this.lusha.enrichContacts({
      $,
      data: {
        ids,
        reveal: this.reveal?.length
          ? this.reveal
          : undefined,
      },
    });
    $.export("$summary", `Successfully enriched ${response.results?.length ?? 0} contact(s)`);
    return response;
  },
};
