const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-get-a-block",
  name: "Get a Block",
  description: "Gets a specific block.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the specific block.",
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
    const validationResult = validate({
      email: this.email,
    }, constraints);
    this.checkValidationResults(validationResult);
    return await this.sendgrid.getBlock(this.email);
  },
};
