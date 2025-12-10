import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-create-twilio-integration",
  name: "Create Twilio Integration",
  description: "Create a new Twilio integration for the authenticated team. [See the documentation](https://docs.usebrainbase.com/api-reference/integrations/create-a-new-twilio-integration-for-the-authenticated-team)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    accountSid: {
      type: "string",
      label: "Account SID",
      description: "Twilio account SID",
    },
    authToken: {
      type: "string",
      label: "Auth Token",
      description: "Twilio auth token (will be encrypted before being stored)",
      secret: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createTwilioIntegration({
      $,
      data: {
        accountSid: this.accountSid,
        authToken: this.authToken,
      },
    });

    $.export("$summary", "Successfully created Twilio integration");
    return response;
  },
};
