import fireflies from "../../fireflies.app.mjs";

export default {
  key: "fireflies-upload-audio",
  name: "Upload Audio",
  description: "Creates and stores a new meeting in Fireflies, allowing it to be transcribed and shared.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    fireflies,
    audioFile: {
      propDefinition: [
        fireflies,
        "audioFile",
      ],
    },
    meetingDetails: {
      propDefinition: [
        fireflies,
        "meetingDetails",
      ],
    },
    transcriptionOption: {
      propDefinition: [
        fireflies,
        "transcriptionOption",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.fireflies.createMeeting(this.audioFile, this.meetingDetails, this.transcriptionOption);
    $.export("$summary", "Successfully created and stored a new meeting");
    return response;
  },
};
