const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-list-blocks",
  name: "List Blocks",
  description:
    "Allows you to list all email addresses that are currently on your blocks list.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    startTime: {
      type: "integer",
      label: "Start Time",
      description:
        "The start of the time range when a blocked email was created (inclusive). This is a unix timestamp.",
      optional: true,
    },
    endTime: {
      type: "integer",
      label: "End Time",
      description:
        "The end of the time range when a blocked email was created (inclusive). This is a unix timestamp.",
      optional: true,
    },
    numberOfBlocks: {
      type: "integer",
      label: "Max # of Blocks to Return",
      description: "Indicates the max number of blocked emails to return.",
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      numberOfBlocks: {
        presence: true,
        type: "integer",
      },
    };
    this.startTime = this.convertEmptyStringToNull(this.startTime);
    if (this.startTime != null) {
      constraints.startTime = this.getIntegerGtZeroConstraint();
    }
    this.endTime = this.convertEmptyStringToNull(this.endTime);
    if (this.endTime != null) {
      constraints.endTime = {
        numericality: {
          onlyInteger: true,
          greaterThan: this.startTime > 0 ?
            this.startTime :
            0,
          message: "must be positive integer, non zero, greater than `startTime`.",
        },
      };
    }
    this.numberOfBlocks = this.convertEmptyStringToNull(this.numberOfBlocks);
    if (this.numberOfBlocks != null) {
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
    const blocksGenerator = await this.sendgrid.listBlocks(
      this.startTime,
      this.endTime,
      this.numberOfBlocks,
    );
    const blocks = [];
    let block;
    do {
      block = await blocksGenerator.next();
      if (block.value) {
        blocks.push(block.value);
      }
    } while (!block.done);
    return blocks;
  },
};
