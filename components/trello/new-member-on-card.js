const trello = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");

module.exports = {
  name: "New Member on Card",
  description:
    "Emits an event for each card joined by the authenticated Trello user.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    trello,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let cards = [];
    let results = [];
    let lastActivity;

    const now = new Date();
    const monthAgo = new Date(now.getTime());
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let lastEvent = this.db.get("lastEvent") || monthAgo;
    lastEvent = new Date(lastEvent);

    results = await this.trello.getMemberCards("me");
    results.forEach(function (card) {
      lastActivity = new Date(card.dateLastActivity);
      if (lastActivity.getTime() > lastEvent.getTime()) {
        cards.push(card);
      }
    });

    this.db.set("lastEvent", now);

    for (const card of cards) {
      this.$emit(card, {
        id: card.id,
        summary: card.name,
        ts: Date.now(),
      });
    }
  },
};