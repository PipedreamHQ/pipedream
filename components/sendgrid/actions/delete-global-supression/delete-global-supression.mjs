import validate from "validate.js";
import common from "../common.mjs";

export default {
  ...common,
  key: "sendgrid-delete-global-supression",
  name: "Delete Global Supression",
  description: "Allows you to remove an email address from the global suppressions group. [See the docs here](https://docs.sendgrid.com/api-reference/suppressions-global-suppressions/delete-a-global-suppression)",
  version: "0.0.1",
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
    const resp = await this.sendgrid.deleteGlobalSupression(this.email);
    $.export("$summary", `Successfully removed ${this.email} from global supression group.`);
    return resp;
  },
};
