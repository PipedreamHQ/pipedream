import validate from "validate.js";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "sendgrid-get-a-block",
  name: "Get a Block",
  description: "Gets a specific block. [See the docs here](https://docs.sendgrid.com/api-reference/blocks-api/retrieve-a-specific-block)",
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
        "blockedEmails",
      ],
      type: "string",
      label: "Email",
      description: "The email address of the specific block",
      optional: false,
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
    const resp = this.sendgrid.getBlock(this.email);
    $.export("$summary", "Successfully retrieved block.");
    return resp;
  },
};
