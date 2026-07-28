// x-pd-ai: optimized
import brexApp from "../../brex.app.mjs";

export default {
  key: "brex-list-cards",
  name: "List Cards",
  description: "List the cards in the Brex account. Returns the full record for each card, "
    + "including status, last four digits, cardholder, and — for vendor cards — the spend "
    + "limit and remaining available balance."
    + " This is the tool for discovering card IDs; pass one to **Get Card** for a single"
    + " card's full record."
    + " Leave Cardholder empty to list every card in the account, or set it to scope results"
    + " to one person — use **List Users** to turn an email address into a user ID first."
    + " Brex has no server-side status filter, so the Status filter is applied after fetching;"
    + " when a status is set, the summary reports how many records were scanned."
    + " [See the documentation](https://developer.brex.com/openapi/team_api/cards/listcardsbyuserid)",
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
      description: "Return only cards owned by this user. Omit to list every card in the account. Use **List Users** to find a user ID by email address.",
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

    const scope = this.status
      ? `${this.status} card(s)`
      : "card(s)";
    const scanNote = this.status
      ? ` (scanned ${scanned})`
      : "";
    const moreNote = truncated
      ? ", more available — raise Max Results to fetch them"
      : "";

    $.export("$summary", `Found ${items.length} ${scope}${scanNote}${moreNote}`);

    return items;
  },
};
