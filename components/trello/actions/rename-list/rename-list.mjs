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
    listId: {
      type: "string",
      label: "List Id",
      description: "The ID of the List to rename.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The new name of the list.",
      optional: true,
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
    return this.trello.renameList(this.listId, {
      name: this.name,
    }, $);
  },
};
