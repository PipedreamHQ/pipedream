const spotify = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");

module.exports = {
  name: "New Boards",
  description: "Emits an event for each new board added.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    trello,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    let boards = [];
    let results = [];

    results = await this.trello.getBoards("me");
    results.forEach(function (board) {
      boards.push(board);
    });

    for (const board of boards) {
      this.$emit(board, {
        id: board.id,
        summary: board.name,
        ts: Date.now(),
      });
    }
  },
};