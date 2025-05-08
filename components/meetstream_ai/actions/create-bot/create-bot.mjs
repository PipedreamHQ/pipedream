import meetstream_ai from "../../meetstream_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "meetstream_ai-create-bot",
  name: "Create Bot",
  description: "Creates a new bot instance to join a meeting. [See the documentation](https://vento.so/view/35d0142d-f91f-47f6-8175-d42e1953d6f1?utm_medium=share)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    meetstream_ai,
    meetingLink: {
      propDefinition: [
        meetstream_ai,
        "meetingLink",
      ],
    },
    botName: {
      propDefinition: [
        meetstream_ai,
        "botName",
      ],
      optional: true,
    },
    audioRequired: {
      propDefinition: [
        meetstream_ai,
        "audioRequired",
      ],
      optional: true,
    },
    videoRequired: {
      propDefinition: [
        meetstream_ai,
        "videoRequired",
      ],
      optional: true,
    },
    liveAudioRequired: {
      propDefinition: [
        meetstream_ai,
        "liveAudioRequired",
      ],
      optional: true,
    },
    liveTranscriptionRequired: {
      propDefinition: [
        meetstream_ai,
        "liveTranscriptionRequired",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.meetstream_ai.createBotInstance({
      meetingLink: this.meetingLink,
      botName: this.botName,
      audioRequired: this.audioRequired,
      videoRequired: this.videoRequired,
      liveAudioRequired: this.liveAudioRequired,
      liveTranscriptionRequired: this.liveTranscriptionRequired,
    });

    $.export("$summary", `Successfully created bot instance for meeting link ${this.meetingLink}`);
    return response;
  },
};
