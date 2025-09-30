import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-get-a-global-suppression",
  name: "Get A Global Suppression",
  description: "Gets a global suppression. [See the docs here](https://docs.sendgrid.com/api-reference/suppressions-global-suppressions/retrieve-a-global-suppression)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    email: {
      propDefinition: [
        common.props.sendgrid,
        "globalSuppressionEmail",
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
    const resp = await this.sendgrid.getGlobalSuppression(this.email);
    $.export("$summary", "Successfully retrieved global suppression.");
    return resp;
  },
};
