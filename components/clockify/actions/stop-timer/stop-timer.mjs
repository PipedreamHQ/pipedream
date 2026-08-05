// x-pd-ai: optimized
import clockify from "../../clockify.app.mjs";

export default {
  key: "clockify-stop-timer",
  name: "Stop Timer",
  description: "Stops the currently running timer for a workspace member in Clockify, setting its end time. [See the documentation](https://docs.clockify.me/#tag/Time-entry)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    clockify,
    workspaceId: {
      propDefinition: [
        clockify,
        "workspaceId",
      ],
    },
    userId: {
      propDefinition: [
        clockify,
        "memberIds",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      type: "string",
      label: "User",
      description: "The workspace member whose running timer should be stopped.",
    },
    end: {
      propDefinition: [
        clockify,
        "end",
      ],
      description: "Date and time to stop the timer at, in ISO 8601 format. Example: `2024-01-01T17:00:00Z`. Defaults to the current time if left blank.",
    },
  },
  async run({ $ }) {
    const response = await this.clockify.stopTimeEntry({
      $,
      workspaceId: this.workspaceId,
      userId: this.userId,
      data: {
        end: this.end || new Date().toISOString(),
      },
    });

    $.export("$summary", "Successfully stopped the running timer");

    return response;
  },
};
