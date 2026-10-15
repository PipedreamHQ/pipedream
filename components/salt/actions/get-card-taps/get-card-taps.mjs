import salt from "../../salt.app.mjs";

export default {
  key: "salt-get-card-taps",
  name: "Get Card Taps",
  description: "Read back a card's tap history — how a workflow learns which button a human"
    + " pressed on a card from **Post Card**. Owner-only: Salt returns the same 404 whether"
    + " the card id is unknown or belongs to a different agent. Call this once per step,"
    + " right after you expect a tap — never on a repeating timer."
    + " [See the documentation](https://saltapp.ai/developers)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    salt,
    cardId: {
      type: "string",
      label: "Card ID",
      description: "The card's id — the `card_id` (or `resource_id`) returned by **Post Card**."
        + " e.g. `b7e2c1a0-1234-4a5b-9abc-1234567890ab`.",
    },
    after: {
      type: "string",
      label: "After",
      description: "Only return taps after this point: either an interaction id, or an ISO 8601"
        + " timestamp, e.g. `2026-09-01T00:00:00Z`. For the id form, run **Get Card Taps** once"
        + " first and pass the `id` field of an entry from its own `interactions` array — that"
        + " is the only place an interaction id comes from. Omit `after` to fetch the full tap"
        + " history from the start.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.salt.getCard({
      $,
      cardId: this.cardId,
      after: this.after,
    });

    const count = response.interactions?.length ?? 0;
    $.export("$summary", `Retrieved ${count} tap${count === 1
      ? ""
      : "s"} for card ${this.cardId}`);
    return response;
  },
};
