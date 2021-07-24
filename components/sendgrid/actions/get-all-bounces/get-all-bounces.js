const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-get-all-bounces",
  name: "Get All Bounces",
  description: "Allows you to get all of your bounces.",
  version: "0.0.23",
  type: "action",
  props: {
    ...common.props,
    startTime: {
      type: "integer",
      label: "Start Time",
      description:
        "Refers start of the time range in unix timestamp when a bounce was created (inclusive).",
      optional: true,
    },
    endTime: {
      type: "integer",
      label: "End Time",
      description:
        "Refers end of the time range in unix timestamp when a bounce was created (inclusive).",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {};
    if (this.startTime != null) {
      constraints.startTime = {
        numericality: {
          onlyInteger: true,
          greaterThan: 0,
          message: "must be positive integer, greater than zero.",
        },
      };
    }
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
    const validationResult = validate(
      {
        startTime: this.startTime,
        endTime: this.endTime,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    return await this.sendgrid.getAllBounces(this.startTime, this.endTime);
  },
};
