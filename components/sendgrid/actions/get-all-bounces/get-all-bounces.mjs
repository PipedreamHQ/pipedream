import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-get-all-bounces",
  name: "Get All Bounces",
  description: "Allows you to get all of your bounces. [See the docs here](https://docs.sendgrid.com/api-reference/bounces-api/retrieve-all-bounces)",
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
    },
    endTime: {
      propDefinition: [
        common.props.sendgrid,
        "endTime",
      ],
    },
  },
  async run({ $ }) {
    const constraints = {};
    this.startTime = this.convertEmptyStringToUndefined(this.startTime);
    if (this.startTime != null) {
      constraints.startTime = this.getIntegerGtZeroConstraint();
    }
    this.endTime = this.convertEmptyStringToUndefined(this.endTime);
    if (this.endTime != null) {
      constraints.endTime = {
        numericality: {
          onlyInteger: true,
          greaterThan: this.startTime > 0
            ? this.startTime
            : 0,
          message: "must be positive integer, non zero, greater than `startTime`",
        },
      };
    }
    const validationResult = validate(
      {
        startTime: this.startTime,
        endTime: this.endTime,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const resp = await this.sendgrid.getAllBounces(this.startTime, this.endTime);
    $.export("$summary", "Successfully retrieved bounces.");
    return resp;
  },
};
