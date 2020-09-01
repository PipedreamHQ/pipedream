const spotify = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");

module.exports = {
  name: "New Labels",
  description: "Emits an event for each new label added to a board.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    trello,
    boardId: {
      type: "string",
      label: "Board ID",
      description: "Search for new labels added to the specified board.",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let labels = [];
    let results = [];

    results = await this.trello.getLabels(this.boardId);
    results.forEach(function (label) {
      labels.push(label);
    });

    for (const label of labels) {
      let summary = label.color;
      summary += label.name ? ` - ${label.name}` : "";
      this.$emit(label, {
        id: label.id,
        summary,
        ts: Date.now(),
      });
    }
  },
};