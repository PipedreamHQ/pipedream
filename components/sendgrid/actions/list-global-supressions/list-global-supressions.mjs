import validate from "validate.js";
import common from "../common.mjs";

export default {
  ...common,
  key: "sendgrid-list-global-suppressions",
  name: "List Global Suppressions",
  description: "Allows you to get a list of all email address that are globally suppressed.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    startTime: {
      type: "integer",
      label: "Start Time",
      description: "Refers start of the time range in unix timestamp when an unsubscribe email was created (inclusive)",
      optional: true,
    },
    endTime: {
      type: "integer",
      label: "End Time",
      description: "Refers end of the time range in unix timestamp when an unsubscribe email was created (inclusive)",
      optional: true,
    },
    numberOfSupressions: {
      type: "integer",
      label: "Max # of Global Suppressions to Return",
      description: "Indicates the max number of global suppressions to return",
    },
  },
  async run({ $ }) {
    const constraints = {
      numberOfSupressions: {
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
          greaterThan: this.startTime > 0
            ? this.startTime
            : 0,
          message: "must be positive integer, non zero, greater than `startTime`.",
        },
      };
    }
    if (this.numberOfSupressions) {
      constraints.numberOfSupressions = this.getIntegerGtZeroConstraint();
    }
    const validationResult = validate(
      {
        startTime: this.startTime,
        endTime: this.endTime,
        numberOfSupressions: this.numberOfSupressions,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const resp = await this.sendgrid.listGlobalSupressions(
      this.startTime,
      this.endTime,
      this.numberOfSuppressions,
    );
    $.export("$summary", "Successfully retrieved global supressions");
    return resp;
  },
};
