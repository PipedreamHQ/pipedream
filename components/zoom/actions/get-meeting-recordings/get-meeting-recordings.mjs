import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-meeting-recordings",
  name: "Get Meeting Recordings",
  description: "Get the recordings of a meeting. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/get/meetings/{meetingId}/recordings)",
  version: "0.0.1",
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
      description: "The meeting ID to get the recordings for",
      optional: false,
    },
    downloadAccessToken: {
      type: "boolean",
      label: "Download Access Token",
      description: "Whether to include the download access token in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    try {
      const recordings = await this.zoom.getMeetingRecordings({
        $,
        meetingId: this.meetingId,
        params: {
          include_fields: this.downloadAccessToken
            ? "download_access_token"
            : undefined,
        },
      });

      $.export("$summary", `Retrieved recordings for meeting ${this.meetingId}`);
      return recordings;
    } catch (error) {
      if ((error.response?.status === 404) && (error.response?.data?.code === 3301)) {
        $.export("$summary", "Recordings not found");
        return {};
      }
      throw error;
    }
  },
};
