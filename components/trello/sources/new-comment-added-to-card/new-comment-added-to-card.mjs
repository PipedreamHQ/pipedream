import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-comment-added-to-card",
  name: "New Comment Added to Card (Instant)",
  description: "Emit new event for each new comment added to a card.",
  version: "0.1.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
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
  hooks: {
    ...common.hooks,
    async deploy() {
      const {
        sampleEvents, sortField,
      } = await this.getSampleEvents();
      sampleEvents.sort((a, b) => (Date.parse(a[sortField]) > Date.parse(b[sortField]))
        ? 1
        : -1);
      for (const action of sampleEvents.slice(-25)) {
        this.emitEvent(action);
      }
    },
  },
  methods: {
    ...common.methods,
    async getSampleEvents() {
      const cards = this.cards && this.cards.length > 0
        ? this.cards
        : (await this.trello.getCards(this.board)).map((card) => card.id);
      const actions = [];
      for (const card of cards) {
        const activities = await this.trello.getCardActivity(card, "commentCard");

        for (const activity of activities) {
          actions.push(await this.getResult(activity));
        }
      }
      return {
        sampleEvents: actions,
        sortField: "date",
      };
    },
    isCorrectEventType(event) {
      const eventType = event.body?.action?.type;
      return eventType === "commentCard";
    },
    async getResult(event) {
      const card = await this.trello.getCard(event?.body?.action?.data?.card?.id ??
        event?.data?.card?.id);
      const member = await this.trello.getMember(event?.body?.action?.idMemberCreator ??
        event.idMemberCreator);

      return {
        member,
        card,
        event: event?.body ?? event,
      };
    },
    isRelevant({ result: { card } }) {
      return (
        (!this.board || this.board === card.idBoard) &&
        (!this.cards || this.cards.length === 0 || this.cards.includes(card.id))
      );
    },
    generateMeta({ event }) {
      return {
        id: event?.action?.id ?? event?.id,
        summary: event?.action?.data?.text ?? event?.data?.text,
        ts: Date.parse(event?.date),
      };
    },
  },
};
