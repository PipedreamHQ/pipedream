import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-delete-global-suppression",
  name: "Delete Global Suppression",
  description: "Allows you to remove an email address from the global suppressions group. [See the docs here](https://docs.sendgrid.com/api-reference/suppressions-global-suppressions/delete-a-global-suppression)",
  version: "0.0.6",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    email: {
      propDefinition: [
        common.props.sendgrid,
        "globalSuppressionEmail",
      ],
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
    const resp = await this.sendgrid.deleteGlobalSuppression(this.email);
    $.export("$summary", `Successfully removed ${this.email} from global suppression group.`);
    return resp;
  },
};
