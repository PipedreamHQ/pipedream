const spotify = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");

module.exports = {
  name: "New Lists",
  description: "Emits an event for each new list added to a board.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    trello,
    boardId: {
      type: "string",
      label: "Board ID",
      description: "Search for new lists added to the specified board.",
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let lists = [];
    let results = [];

    results = await this.trello.getLists(this.boardId);
    results.forEach(function (list) {
      lists.push(list);
    });

    for (const list of lists) {
      this.$emit(list, {
        id: list.id,
        summary: list.name,
        ts: Date.now(),
      });
    }
  },
};