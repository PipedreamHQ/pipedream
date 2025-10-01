import meetstreamAi from "../../meetstream_ai.app.mjs";

export default {
  key: "meetstream_ai-create-bot",
  name: "Create Bot",
  description: "Creates a new bot instance to join a meeting. [See the documentation](https://vento.so/view/35d0142d-f91f-47f6-8175-d42e1953d6f1?utm_medium=share)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    meetstreamAi,
    meetingLink: {
      type: "string",
      label: "Meeting Link",
      description: "The link to the meeting where the bot should join",
    },
    botName: {
      type: "string",
      label: "Bot Name",
      description: "The name of the bot",
      optional: true,
    },
    audioRequired: {
      type: "boolean",
      label: "Audio Required",
      description: "Whether audio is required",
      optional: true,
    },
    videoRequired: {
      type: "boolean",
      label: "Video Required",
      description: "Whether video is required",
      optional: true,
    },
    liveAudioRequired: {
      type: "string",
      label: "Live Audio Websocket URL",
      description: "Specify websocket_url for live audio streaming",
      optional: true,
    },
    liveTranscriptionRequired: {
      type: "string",
      label: "Live Transcription Webhook URL",
      description: "Specify webhook_url for live transcription",
      optional: true,
    },
    deepgramApiKey: {
      type: "string",
      label: "Deepgram API Key",
      description: "This key is required if you use a **Google Meet** link and **Live Transcription Webhook URL** is specified",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.meetstreamAi.createBotInstance({
      $,
      data: {
        meeting_link: this.meetingLink,
        bot_name: this.botName,
        audio_required: this.audioRequired,
        video_required: this.videoRequired,
        live_audio_required: {
          websocket_url: this.liveAudioRequired,
        },
        live_transcription_required: {
          deepgram_api_key: this.deepgramApiKey,
          webhook_url: this.liveTranscriptionRequired,
        },
      },
    });

    $.export("$summary", `Successfully created bot instance for meeting link ${this.meetingLink}`);
    return response;
  },
};
