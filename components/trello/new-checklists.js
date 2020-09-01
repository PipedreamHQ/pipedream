const spotify = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");

module.exports = {
  name: "New Checklists",
  description: "Emits an event for each new checklist added to a board.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    trello,
    boardId: {
      type: "string",
      label: "Board ID",
      description: "Search for new checklists added to the specified board.",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let checklists = [];
    let results = [];

    results = await this.trello.getChecklists(this.boardId);
    results.forEach(function (checklist) {
      checklists.push(checklist);
    });

    for (const checklist of checklists) {
      this.$emit(checklist, {
        id: checklist.id,
        summary: checklist.name,
        ts: Date.now(),
      });
    }
  },
};