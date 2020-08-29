const spotify = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");

module.exports = {
  name: "Card Updates",
  description: "Emits an event for each update to a Trello card.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    trello,
    cardId: {
      type: "string",
      label: "Card ID",
      description: "Search for updates to the card specified.",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let updates = [];
    let results = [];
    let dateUpdated;

    const now = new Date();
    const monthAgo = new Date(now.getTime());
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let lastEvent = this.db.get("lastEvent") || monthAgo;
    lastEvent = new Date(lastEvent);

    results = await this.trello.getCardActions(this.cardId);
    results.forEach(function (update) {
      dateUpdated = new Date(update.date);
      if (dateUpdated.getTime() > lastEvent.getTime()) {
        updates.push(update);
      }
    });

    this.db.set("lastEvent", now);

    for (const update of updates) {
      this.$emit(update, {
        id: update.id,
        summary: `${update.type} : ${update.data.card.name}`,
        ts: update.date,
      });
    }
  },
};