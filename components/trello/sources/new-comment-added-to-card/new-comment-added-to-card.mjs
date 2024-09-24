import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "trello-new-comment-added-to-card",
  name: "New Comment Added to Card (Instant)",
  description: "Emit new event for each new comment added to a card.",
  version: "0.2.0",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.app,
        "board",
      ],
    },
    cards: {
      propDefinition: [
        common.props.app,
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
    getCardActivity({
      cardId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/cards/${cardId}/actions`,
        ...args,
      });
    },
    async getSampleEvents() {
      const cards = this.cards && this.cards.length > 0
        ? this.cards
        : (await this.app.getCards({
          boardId: this.board,
        })).map((card) => card.id);
      const actions = [];
      for (const card of cards) {
        const activities = await this.getCardActivity({
          cardId: card,
          params: {
            filter: "commentCard",
          },
        });

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
      const cardId = event?.body?.action?.data?.card?.id ??
      event?.data?.card?.id;
      const card = await this.app.getCard({
        cardId,
      });
      const memberId = event?.body?.action?.idMemberCreator ??
      event.idMemberCreator;
      const member = await this.app.getMember({
        memberId,
      });

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
