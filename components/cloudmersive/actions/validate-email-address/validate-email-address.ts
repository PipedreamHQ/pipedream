import { defineAction } from "@pipedream/types";
import cloudmersive from "../../app/cloudmersive.app";
import { DOCS } from "../../common/constants";
import { ValidateEmailAddressParams } from "../../common/types";

export default defineAction({
  name: "Validate Email Address",
  description: `Validate an email address [See docs here](${DOCS.validateEmailAddress})`,
  key: "cloudmersive-validate-email-address",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    cloudmersive,
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address to validate.",
    },
  },
  async run({ $ }) {
    const { email } = this;
    const params: ValidateEmailAddressParams = {
      $,
      email,
    };

    const response = await this.cloudmersive.validateEmailAddress(params);

    $.export("$summary", `Validated email "${email}"`);

    return response;
  },
});
