import twilio from "../../twilio.app.mjs";

export default {
  key: "twilio-create-verification-service",
  name: "Create Verification Service",
  description: "Create a verification service for sending SMS verifications. [See the documentation](https://www.twilio.com/docs/verify/api/service#create-a-verification-service)",
  type: "action",
  version: "0.0.3",
  props: {
    twilio,
    friendlyName: {
      type: "string",
      label: "Friendly Name",
      description: "The name of the new verification service",
    },
  },
  async run({ $ }) {
    const response = await this.twilio.createVerificationService({
      friendlyName: this.friendlyName,
    });
    $.export("$summary", `Successfully created verification service with SID: ${response.sid}"`);
    return response;
  },
};
