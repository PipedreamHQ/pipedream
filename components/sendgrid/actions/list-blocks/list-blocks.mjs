import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-list-blocks",
  name: "List Blocks",
  description: "Allows you to list all email addresses that are currently on your blocks list. [See the docs here](https://docs.sendgrid.com/api-reference/blocks-api/retrieve-all-blocks)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    startTime: {
      propDefinition: [
        common.props.sendgrid,
        "startTime",
      ],
      description: "The start of the time range when a blocked email was created (inclusive). This is a unix timestamp.",
    },
    endTime: {
      propDefinition: [
        common.props.sendgrid,
        "endTime",
      ],
      description: "The end of the time range when a blocked email was created (inclusive). This is a unix timestamp.",
    },
    numberOfBlocks: {
      type: "integer",
      label: "Max # of Blocks to Return",
      description: "Indicates the max number of blocked emails to return",
    },
  },
  async run({ $ }) {
    const constraints = {
      numberOfBlocks: {
        type: "integer",
      },
    };
    if (this.startTime) {
      constraints.startTime = this.getIntegerGtZeroConstraint();
    }
    if (this.endTime) {
      constraints.endTime = {
        numericality: {
          onlyInteger: true,
          greaterThan: this.startTime > 0 ?
            this.startTime :
            0,
          message: "must be positive integer, non zero, greater than `startTime`",
        },
      };
    }
    if (this.numberOfBlocks) {
      constraints.numberOfBlocks = this.getIntegerGtZeroConstraint();
    }
    const validationResult = validate(
      {
        startTime: this.startTime,
        endTime: this.endTime,
        numberOfBlocks: this.numberOfBlocks,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const resp = await this.sendgrid.listBlocks(
      this.startTime,
      this.endTime,
      this.numberOfBlocks,
    );
    $.export("$summary", "Successsfully retrieved blocks");
    return resp;
  },
};
