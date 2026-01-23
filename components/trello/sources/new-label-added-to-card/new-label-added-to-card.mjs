import common from "../common/common-webhook.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "trello-new-label-added-to-card",
  name: "New Label Added To Card (Instant)",
  description: "Emit new event for each label added to a card.",
  version: "0.1.4",
  type: "source",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    list: {
      propDefinition: [
        common.props.app,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "List",
      description: "If specified, events will only be emitted when a label is added to a card in the specified lists",
    },
    cards: {
      propDefinition: [
        common.props.app,
        "cards",
        (c) => ({
          board: c.board,
          list: c.list,
        }),
      ],
      description: "If specified, events will only be emitted when a label is added to one of the specified cards",
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      if (this.cards?.length) {
        await this.emitLabelsFromCardIds(this.cards);
        return;
      }
      if (this.list) {
        const cards = await this.app.getCardsInList({
          listId: this.list,
        });
        await this.emitLabelsFromCards(cards);
        return;
      }
      const cards = await this.app.getCards({
        boardId: this.board,
      });
      await this.emitLabelsFromCards(cards);
    },
  },
  methods: {
    ...common.methods,
    async emitLabelsFromCards(cards) {
      for (const card of cards) {
        const labelIds = card.idLabels;
        for (const labelId of labelIds) {
          const label = await this.app.getLabel({
            labelId,
          });
          let summary = label.color;
          summary += label.name
            ? ` - ${label.name}`
            : "";
          summary += `; added to ${card.name}`;
          this.$emit(card, {
            id: `${labelId}${card.id}`,
            summary,
            ts: Date.now(),
          });
        }
      }
    },
    async emitLabelsFromCardIds(cardIds) {
      const cards = [];
      for (const cardId of cardIds) {
        const card = await this.app.getCard({
          cardId,
        });
        cards.push(card);
      }
      await this.emitLabelsFromCards(cards);
    },
    _getLabelName() {
      return this.db.get("labelName");
    },
    _setLabelName(labelName) {
      this.db.set("labelName", labelName);
    },
    _getLabelColor() {
      return this.db.get("labelColor");
    },
    _setLabelColor(labelColor) {
      this.db.set("labelColor", labelColor);
    },
    isCorrectEventType({ type }) {
      return type === "addLabelToCard";
    },
    getResult({ data }) {
      /** Record labelName & labelColor to use in generateMeta() */
      this._setLabelName(data?.label?.name);
      this._setLabelColor(data?.label?.color);
      return this.app.getCard({
        cardId: data?.card?.id,
      });
    },
    isRelevant({ result: card }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.list || this.list === card.idList) &&
        (!this.cards?.length || this.cards.includes(card.id))
      );
    },
    generateMeta({
      id, name,
    }) {
      const labelName = this._getLabelName();
      const labelColor = this._getLabelColor();
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
  sampleEmit,
};
