import zoom from "../../zoom.app.mjs";

export default {
  key: "zoom-get-meeting-records",
  name: "Get Meeting Records",
  description: "Get the records of a meeting. [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/get/meetings/{meetingId}/recordings)",
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
      description: "The meeting ID to get the records for",
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
      const records = await this.zoom.getMeetingRecords({
        $,
        meetingId: this.meetingId,
        params: {
          include_fields: this.downloadAccessToken
            ? "download_access_token"
            : undefined,
        },
      });

      $.export("$summary", `Retrieved records for meeting ${this.meetingId}`);
      return records;
    } catch ({ response }) {
      console.log("response: ", response);

      if (response.data.status === 200) {
        $.export("$summary", "You do not have the right permissions");
        return {};
      }
      if (response.status === 404) {
        $.export("$summary", "Records not found");
        return {};
      }
      throw response;
    }
  },
};
