import validate from "validate.js";
import common from "../common.js";

export default {
  ...common,
  key: "trello-find-labels",
  name: "Find a Label",
  description: "Finds a label on a specific board by name. [See the docs here](https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-labels-get)",
  version: "0.1.2",
  type: "action",
  props: {
    ...common.props,
    board: {
      propDefinition: [
        common.props.trello,
        "board",
      ],
      description: "Unique identifier of the board to search for labels",
    },
    name: {
      propDefinition: [
        common.props.trello,
        "name",
      ],
      label: "Label Name",
      description: "Name of the label to find.",
      optional: false,
    },
    labelLimit: {
      type: "integer",
      label: "Label Limit",
      description: "The number of labels to be returned.",
      default: 50,
    },
  },
  async run({ $ }) {
    const constraints = {
      labelLimit: {
        type: "integer",
        numericality: {
          greaterThanOrEqualTo: 0,
          lessThanOrEqualTo: 1000,
          message: "must be a positive integer greater than or equal to 0, and less than or equal to 1000.",
        },
      },
    };
    const validationResult = validate({
      labelLimit: this.labelLimit,
    }, constraints);
    this.checkValidationResults(validationResult);
    const opts = {
      limit: this.labelLimit,
    };
    const labels = await this.trello.findLabel(this.board, opts, $);
    const res = this.getMatches(labels, this.name);
    $.export("$summary", `Successfully retrieved labels with name ${this.name}`);
    return res;
  },
};
