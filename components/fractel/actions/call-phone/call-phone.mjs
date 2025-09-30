import fractel from "../../fractel.app.mjs";

export default {
  key: "fractel-call-phone",
  name: "Call Phone",
  description: "Initiates a new phone call to the provided number.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fractel,
    phoneNumber: {
      propDefinition: [
        fractel,
        "phoneNumber",
      ],
    },
    to: {
      propDefinition: [
        fractel,
        "to",
      ],
    },
    message: {
      propDefinition: [
        fractel,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.fractel.initiateCall({
      $,
      data: {
        fonenumber: this.phoneNumber,
        to: this.to,
        service_type: "TTS",
        service_id: this.message,
      },
    });

    $.export("$summary", `Successfully initiated a call with Id: ${response.call.id}`);
    return response;
  },
};
