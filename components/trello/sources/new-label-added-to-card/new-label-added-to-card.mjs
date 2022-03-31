import common from "../common-webhook.mjs";
import get from "lodash/get.js";

export default {
  ...common,
  key: "trello-new-label-added-to-card",
  name: "New Label Added To Card (Instant)",
  description: "Emit new event for each label added to a card.",
  version: "0.0.6",
  type: "source",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    lists: {
      propDefinition: [
        common.props.trello,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
    },
    cards: {
      propDefinition: [
        common.props.trello,
        "cards",
        (c) => ({
          board: c.board,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    isCorrectEventType(event) {
      const eventType = get(event, "body.action.type");
      return eventType === "addLabelToCard";
    },
    async getResult(event) {
      const cardId = get(event, "body.action.data.card.id");
      const labelName = get(event, "body.action.data.label.name");
      const labelColor = get(event, "body.action.data.label.color");
      /** Record labelName & labelColor to use in generateMeta() */
      this.db.set("labelName", labelName);
      this.db.set("labelColor", labelColor);
      return await this.trello.getCard(cardId);
    },
    isRelevant({ result: card }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.lists ||
          this.lists.length === 0 ||
          this.lists.includes(card.idList)) &&
        (!this.cards || this.cards.length === 0 || this.cards.includes(card.id))
      );
    },
    generateMeta({
      id, name,
    }) {
      const labelName = this.db.get("labelName");
      const labelColor = this.db.get("labelColor");
      let summary = labelColor;
      summary += labelName
        ? ` - ${labelName}`
        : "";
      summary += `; added to ${name}`;
      return {
        id,
        summary,
        ts: Date.now(),
      };
    },
    emitEvent(card, labelName, labelColor) {
      const meta = this.generateMeta(card, labelName, labelColor);
      this.$emit(card, meta);
    },
  },
};
