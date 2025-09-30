import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-list-global-suppressions",
  name: "List Global Suppressions",
  description: "Allows you to get a list of all email address that are globally suppressed. [See the docs here](https://docs.sendgrid.com/api-reference/suppressions-global-suppressions/retrieve-all-global-suppressions)",
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
      description: "Refers start of the time range in unix timestamp when an unsubscribe email was created (inclusive)",
    },
    endTime: {
      propDefinition: [
        common.props.sendgrid,
        "endTime",
      ],
      description: "Refers end of the time range in unix timestamp when an unsubscribe email was created (inclusive)",
    },
    numberOfSupressions: {
      type: "integer",
      label: "Max # of Global Suppressions to Return",
      description: "Indicates the max number of global suppressions to return",
      optional: true,
      default: 20,
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
    const resp = await this.sendgrid.listGlobalSuppressions(
      this.startTime,
      this.endTime,
      this.numberOfSuppressions,
    );
    $.export("$summary", "Successfully retrieved global supressions");
    return resp;
  },
};
