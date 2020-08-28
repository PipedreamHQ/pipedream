const spotify = require("https://github.com/PipedreamHQ/pipedream/components/trello/trello.app.js");

module.exports = {
  name: "New Cards",
  description: "Emits an event for each new Trello card on a board.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    trello,
    boardId: {
      type: "string",
      label: "Board ID",
      description: "(Optional) Search for new cards added to the specified board.",
      default: "",
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "(Optional) Search for new cards added to the specified list.",
      default: "",
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
    let cards = [];
    let boards, cardsOnBoard, lastActivity;
    let results = [];

    const now = new Date();
    const monthAgo = new Date(now.getTime());
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    let lastEvent = this.db.get("lastEvent") || monthAgo;
    lastEvent = new Date(lastEvent);

    if (this.listId.length>0) {
      // get cards in list
      results = await this.trello.getListCards(this.listId);
    } else if (this.boardId.length>0) {
      // get cards in board
      results = await this.trello.getCards(this.boardId);
    } else {
      // get cards on all the user's boards
      boards = await this.trello.getBoards('me');
      for(var i=0;i<boards.length;i++) {
        cardsOnBoard = await this.trello.getCards(boards[i].id);
        cardsOnBoard.forEach(function(card) {
          results.push(card);
        });
      }
    }
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
        ts: now,
      });
    }
  },
};