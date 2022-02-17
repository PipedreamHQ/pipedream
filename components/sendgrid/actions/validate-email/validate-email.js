const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-validate-email",
  name: "Validate Email",
  description:
    "Validates an email address. This action requires a Sendgrid's Pro or Premier plan.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    email: {
      type: "string",
      label: "Email",
      description: "The email that you want to validate.",
    },
    source: {
      type: "string",
      label: "Source",
      description:
        "An optional indicator of the email address's source. You may include this if you are capturing email addresses from multiple locations.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
  },
  async run() {
    const constraints = {
      email: {
        email: true,
      },
    };
    const validationResult = validate(
      {
        email: this.email,
      },
      constraints,
    );
    this.checkValidationResults(validationResult);
    const body = {
      email: this.email,
      source: this.convertEmptyStringToUndefined(this.source),
    };
    return this.sendgrid.validateEmail(body);
  },
};
