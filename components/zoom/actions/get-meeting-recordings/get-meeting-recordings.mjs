// x-pd-ai: optimized
import zoom from "../../zoom.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "zoom-get-meeting-recordings",
  name: "Get Meeting Recordings",
  description: "Get the cloud recording metadata for one Zoom meeting."
    + " Use when you need to know what a meeting recorded — its video, audio, chat, and transcript files — or to pick a specific file to download."
    + " To find a meeting ID, call **List Meetings** or **List All Recordings** first."
    + " Returns the meeting's details plus a `recording_files` array whose entries each carry `id`, `file_type`, `file_size`, `recording_type`, and `status`."
    + " This is metadata only: the `download_url` on each file does not work on its own — pass that file's `id` to **Get Recording Download Link** to get a usable URL."
    + " Example: call with meetingId=`84598792483` → returns the meeting's topic and start time plus recording files such as"
    + " `{ id: \"a1b2c3d4-5e6f-7890-abcd-ef1234567890\", file_type: \"MP4\", recording_type: \"shared_screen_with_speaker_view\", file_size: 148203910, status: \"completed\" }`."
    + " A meeting with no cloud recordings returns an empty `recording_files` array rather than an error, so check the array's length before reporting a failure."
    + " [See the documentation](https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/get/meetings/{meetingId}/recordings)",
  version: "0.1.1",
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
      description: "The meeting to get the recordings for. For a recurring meeting, pass the meeting **UUID** (available from **List All Recordings**) to target a specific occurrence — the numeric meeting ID always returns the most recent one.",
      optional: false,
    },
  },
  async run({ $ }) {
    try {
      const recordings = await this.zoom.getMeetingRecordings({
        $,
        meetingId: this.meetingId,
      });

      const count = recordings?.recording_files?.length ?? 0;
      $.export("$summary", `Retrieved ${utils.summaryEnd(count, "recording file")} for meeting ${this.meetingId}`);
      return recordings;
    } catch (error) {
      // Zoom reports "this meeting has no cloud recordings" as 404/3301. That's an empty
      // result rather than a failure, so return the same shape a hit would have — a caller
      // can then read `recording_files` unconditionally instead of interpreting an error.
      if ((error.response?.status === 404) && (error.response?.data?.code === 3301)) {
        $.export("$summary", `No cloud recordings found for meeting ${this.meetingId}`);
        return {
          recording_files: [],
          message: `Meeting ${this.meetingId} has no cloud recordings.`,
        };
      }
      throw error;
    }
  },
};
