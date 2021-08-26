const base = require("./common-webhook.js");

module.exports = {
  ...base,
  props: {
    key: "trello-sources-board-based-file",
    name: "Sources Board Based File",
    description: "Common file with methods and props for Trello board based sources.",
    type: "source",
    ...base.props,
    board: {
      propDefinition: [
        base.props.trello,
        "board",
      ],
    },
  },
  methods: {
    ...base.methods,
    /**
     * Default isRelevant for components that only filter the results by a specified board.
     * @param {object} result - The result item obtained by the component.
     */
    isRelevant({ result }) {
      return !this.board || this.board === result.idBoard;
    },
  },
};
