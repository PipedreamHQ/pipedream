import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-register-phone-number",
  name: "Register Phone Number",
  description:
    "Register a phone number for the team via Twilio integration. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number to register (e.g., +1234567890)",
    },
    integrationId: {
      propDefinition: [app, "integrationId"],
      description: "Twilio integration identifier",
    },
  },
  async run({ $ }) {
    const response = await this.app.registerPhoneNumber({
      $,
      data: {
        phoneNumber: this.phoneNumber,
        integrationId: this.integrationId,
      },
    });

    $.export(
      "$summary",
      `Successfully registered phone number ${this.phoneNumber}`
    );
    return response;
  },
};
