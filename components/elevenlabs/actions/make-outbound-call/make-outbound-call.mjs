import elevenlabs from "../../elevenlabs.app.mjs";

export default {
  key: "elevenlabs-make-outbound-call",
  name: "Make Outbound Call",
  description: "Handle an outbound call via Twilio with Elevenlabs. [See the documentation](https://elevenlabs.io/docs/api-reference/conversations/twilio-outbound-call)",
  version: "0.0.1",
  type: "action",
  props: {
    elevenlabs,
    agentId: {
      propDefinition: [
        elevenlabs,
        "agentId",
      ],
    },
    agentPhoneNumberId: {
      propDefinition: [
        elevenlabs,
        "phoneNumberId",
      ],
    },
    toNumber: {
      type: "string",
      label: "To Number",
      description: "The recipient phone number",
    },
  },
  async run({ $ }) {
    const response = await this.elevenlabs.makeOutboundCall({
      $,
      data: {
        agent_id: this.agentId,
        agent_phone_number: this.agentPhoneNumberId,
        to_number: this.toNumber,
      },
    });
    if (response?.success) {
      $.export("$summary", `Successfully made outbound call to ${this.toNumber}`);
    }
    return response;
  },
};
