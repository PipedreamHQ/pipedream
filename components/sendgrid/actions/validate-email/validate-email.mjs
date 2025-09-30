import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-validate-email",
  name: "Validate Email",
  description: "Validates an email address. This action requires a Sendgrid's Pro or Premier plan. [See the docs here](https://docs.sendgrid.com/api-reference/e-mail-address-validation/validate-an-email)",
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
        "email",
      ],
    },
    source: {
      type: "string",
      label: "Source",
      description: "An optional indicator of the email address's source. You may include this if you are capturing email addresses from multiple locations.",
      optional: true,
    },
  },
  async run({ $ }) {
    const account = await this.sendgrid.getAccountInformation();
    if (account.type === "free") {
      throw new Error("This action is only eligible for SendGrid Email API Pro and Premier plans.");
    }
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
      source: this.source,
    };
    const resp = await this.sendgrid.validateEmail(body);
    $.export("$summary", "Email validation completed");
    return resp;
  },
};
