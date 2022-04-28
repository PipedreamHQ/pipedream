import validate from "validate.js";
import common from "../common.mjs";

export default {
  ...common,
  key: "sendgrid-get-a-global-supression",
  name: "Get A Global Supression",
  description: "Gets a global supression. [See the docs here](https://docs.sendgrid.com/api-reference/suppressions-global-suppressions/retrieve-a-global-suppression)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    email: {
      propDefinition: [
        common.props.sendgrid,
        "email",
      ],
      description: "The email address of the global suppression you want to retrieve",
    },
  },
  async run({ $ }) {
    const constraints = {
      email: {
        email: true,
      },
    };
    const validationResult = validate({
      email: this.email,
    }, constraints);
    this.checkValidationResults(validationResult);
    const resp = await this.sendgrid.getGlobalSupression(this.email);
    $.export("$summary", "Successfully retrieved global supression.");
    return resp;
  },
};
