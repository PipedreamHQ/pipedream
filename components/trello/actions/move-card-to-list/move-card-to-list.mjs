import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-move-card-to-list",
  name: "Move Card to List",
  description: "Moves a card to the specified board/list pair.",
  version: "0.1.2",
  type: "action",
  props: {
    ...common.props,
    idCard: {
      type: "string",
      label: "Id Card",
      description: "The ID of the Card to move.",
    },
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
      label: "To Id Board",
      description: "The ID of the board the card should be moved to. Must match pattern `^[0-9a-fA-F]{24}$`.",
    },
    toIdList: {
      type: "string",
      label: "To Id List",
      description: "The ID of the list that the card should be moved to.",
    },
  },
  async run({ $ }) {
    const constraints = {
      idCard: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Card id", {
              id: value,
            });
          },
        },
      },
      board: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid Board id", {
              id: value,
            });
          },
        },
      },
      toIdList: {
        presence: true,
        format: {
          pattern: "^[0-9a-fA-F]{24}$",
          message: function (value) {
            return validate.format("^%{id} is not a valid List id", {
              id: value,
            });
          },
        },
      },
    };
    const validationResult = validate(
      {
        idCard: this.idCard,
        board: this.board,
        toIdList: this.toIdList,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return this.trello.moveCardToList(this.idCard, {
      idBoard: this.board,
      idList: this.toIdList,
    }, $);
  },
};
