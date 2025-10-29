import zoomAdmin from "../../zoom_admin.app.mjs";

export default {
  key: "zoom_admin-get-meeting-transcript",
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
    zoomAdmin,
    meetingId: {
      propDefinition: [
        zoomAdmin,
        "meeting",
      ],
      description: "The meeting ID to get the transcript for",
    },
  },
  methods: {
    getMeetingTranscript({
      meetingId, ...opts
    }) {
      return this.zoomAdmin._makeRequest({
        path: `/meetings/${meetingId}/transcript`,
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const meetingId = this.meetingId.value || this.meetingId;
    const { data: transcript } = await this.getMeetingTranscript({
      $,
      meetingId,
    });

    $.export("$summary", `Retrieved transcript for meeting ${meetingId}`);
    return transcript;
  },
};
