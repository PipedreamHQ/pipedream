import flashSystem from "../../flash-by-veloraai.app.mjs";

export default {
  key: "flash-by-veloraai-upload-transcript",
  name: "Upload Transcript",
  description: "Transfers a contact call transcript to the flash system for thorough analysis. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    flashSystem,
    transcriptContent: {
      propDefinition: [
        flashSystem,
        "transcriptContent",
      ],
    },
    callId: {
      propDefinition: [
        flashSystem,
        "callId",
      ],
    },
    callerId: {
      propDefinition: [
        flashSystem,
        "callerId",
        (c) => ({
          callerId: c.callerId,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.flashSystem.sendTranscript({
      transcriptContent: this.transcriptContent,
      callId: this.callId,
      callerId: this.callerId,
    });
    $.export("$summary", `Transcript for call ID ${this.callId} uploaded successfully`);
    return response;
  },
};
