import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-meeting-transcript",
  name: "Get Meeting Transcript",
  description: "Get the transcript of a meeting. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/get/meetings/{meetingId}/transcript)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zoom,
    meetingId: {
      propDefinition: [
        zoom,
        "meetingId",
        () => ({
          type: "previous_meetings",
        }),
      ],
      description: "The meeting ID to get the transcript for",
      optional: false,
    },
  },
  async run({ $: step }) {
    const transcript = await this.zoom.getMeetingTranscript({
      step,
      meetingId: this.meetingId,
    });

    step.export("$summary", `Retrieved transcript for meeting ${this.meetingId}`);
    return transcript;
  },
};
