import grain from "../../grain.app.mjs";

export default {
  key: "grain-manage-recording-sharing",
  name: "Manage Recording Sharing",
  description: "Shares or unshares a recording with a specific user or team."
    + " Use **List Recordings** to find the recording's ID, and **List Users** or **List Teams** to resolve the target's ID."
    + " Set `operation` to `share` to grant access or `unshare` to revoke it, and `targetType` to `user` or `team`."
    + " Example: `recordingId: \"pppp6666-qq77-rr88-ss99-tttt00000000\", operation: \"share\", targetType: \"user\", targetId: \"d91b7ed0-a149-425c-9623-0664148e4fc1\"` shares the recording with that user and returns `{\"success\": true}`."
    + " [See the documentation](https://developers.grain.com/#share-recording-to-a-team)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    grain,
    recordingId: {
      propDefinition: [
        grain,
        "recordingId",
      ],
    },
    operation: {
      type: "string",
      label: "Operation",
      description: "Whether to share or unshare the recording.",
      options: [
        "share",
        "unshare",
      ],
    },
    targetType: {
      type: "string",
      label: "Target Type",
      description: "Whether the target is a user or a team.",
      options: [
        "user",
        "team",
      ],
    },
    targetId: {
      type: "string",
      label: "Target ID",
      description: "The ID of the user (from **List Users**) or team (from **List Teams**) to share or unshare the recording with. E.g. `d91b7ed0-a149-425c-9623-0664148e4fc1`.",
    },
  },
  async run({ $ }) {
    if (this.operation === "share") {
      await this.grain.shareRecording({
        $,
        recordingId: this.recordingId,
        targetType: this.targetType,
        data: {
          [`${this.targetType}_id`]: this.targetId,
        },
      });
    } else {
      await this.grain.unshareRecording({
        $,
        recordingId: this.recordingId,
        targetType: this.targetType,
        targetId: this.targetId,
      });
    }

    const summary = `${this.operation === "share"
      ? "Shared"
      : "Unshared"} recording ${this.recordingId} ${this.operation === "share"
      ? "with"
      : "from"} ${this.targetType} ${this.targetId}`;
    $.export("$summary", summary);
    return {
      recordingId: this.recordingId,
      operation: this.operation,
      targetType: this.targetType,
      targetId: this.targetId,
    };
  },
};
