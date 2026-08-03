// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";
import { formatSearchSummary } from "../../common/utils.mjs";

export default {
  key: "brex-list-cards",
  name: "List Cards",
  description: "Lists the cards in the Brex account with their status, last four digits, cardholder, and spend limit. This is how you find the card ID that **Get Card**, **Freeze Card**, **Cancel Card**, and **Update Card Limit** require. [See the documentation](https://developer.brex.com/openapi/team_api/cards/listcardsbyuserid)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    brexApp,
    userId: {
      propDefinition: [
        brexApp,
        "user",
      ],
      label: "Cardholder",
      description: "Return only cards owned by this person, as a Brex user ID, e.g. `cuuser_ckze72soa117f01pkmf1wcpl3`. Omit to list every card in the account. Use **List Users** to find a user ID by email address.",
    },
    status: {
      propDefinition: [
        brexApp,
        "cardStatus",
      ],
    },
    maxResults: {
      propDefinition: [
        brexApp,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      items, scanned, truncated,
    } = await this.brexApp.listCardsPaginated({
      $,
      params: {
        user_id: this.userId,
      },
      max: this.maxResults,
      filter: this.status
        ? (card) => card.status === this.status
        : undefined,
    });

    $.export("$summary", formatSearchSummary({
      count: items.length,
      noun: this.status
        ? `${this.status} card(s)`
        : "card(s)",
      scanned,
      truncated,
    }));

    return items;
  },
};
