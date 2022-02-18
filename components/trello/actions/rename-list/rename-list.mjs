import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-list-rename",
  name: "List Rename",
  description: "Renames the specified list.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
    },
    listId: {
      propDefinition: [
        common.props.trello,
        "lists",
        (c) => ({
          board: c.board,
        }),
      ],
      type: "string",
      label: "List",
      description: "The ID of the List to rename",
      optional: false,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name of the list",
    },
  },
  async run({ $ }) {
    const constraints = {
      listId: {
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
      name: {
        presence: true,
      },
    };
    const validationResult = validate(
      {
        listId: this.listId,
        name: this.name,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const res = await this.trello.renameList(this.listId, {
      name: this.name,
    }, $);
    $.export("$summary", `Successfully renamed list to ${this.name}`);
    return res;
  },
};
