const validate = require("validate.js");
const common = require("../common");

module.exports = {
  ...common,
  key: "sendgrid-get-a-global-supression",
  name: "Get A Global Supression",
  description: "Gets a global supression.",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    email: {
      type: "string",
      label: "Email",
      description:
        "The email address of the global suppression you want to retrieve.",
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
    return this.sendgrid.getGlobalSupression(this.email);
  },
};
