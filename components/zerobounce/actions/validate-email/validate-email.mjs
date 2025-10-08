import zerobounce from "../../zerobounce.app.mjs";

export default {
  key: "zerobounce-validate-email",
  name: "Validate Email",
  description: "Validates a specific email. [See the documentation](https://www.zerobounce.net/docs/email-validation-api-quickstart/#validate_emails__v2__)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zerobounce,
    email: {
      type: "string",
      label: "Email",
      description: "The email address to be validated",
    },
    ipAddress: {
      type: "string",
      label: "IP Address",
      description: "The IP Address the email signed up from",
      optional: true,
    },
    activityData: {
      type: "boolean",
      label: "Activity Data",
      description: "If set to `true`, Activity Data information will be appended to the validation result",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zerobounce.validateEmail({
      $,
      params: {
        email: this.email,
        ip_address: this.ipAddress || "",
        activity_data: this.activityData,
      },
    });
    $.export("$summary", `Successfully validated email: ${this.email}`);
    return response;
  },
};
