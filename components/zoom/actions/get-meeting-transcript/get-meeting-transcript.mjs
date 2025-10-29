import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-meeting-transcript",
  name: "Get Meeting Transcript",
  description: "Get the transcript of a meeting. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/get/meetings/{meetingId}/transcript)",
  version: "0.0.3",
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
      ],
      description: "The meeting ID to get the transcript for",
      optional: false,
    },
  },
  methods: {
    getMeetingTranscript({
      meetingId, ...opts
    }) {
      return this.zoom._makeRequest({
        path: `/meetings/${meetingId}/transcript`,
        ...opts,
      });
    },
  },
  async run({ $: step }) {
    const transcript = await this.getMeetingTranscript({
      step,
      meetingId: this.meetingId,
    });

    step.export("$summary", `Retrieved transcript for meeting ${this.meetingId}`);
    return transcript;
  },
};
