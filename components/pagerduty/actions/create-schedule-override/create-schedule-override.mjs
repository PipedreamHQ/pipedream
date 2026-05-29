import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-create-schedule-override",
  name: "Create Schedule Override",
  description:
    "Override a schedule layer to assign a specific user for a time window."
    + " Use **List Schedules** to find a schedule ID and **List Users** to find the user ID."
    + " Time params use ISO 8601 with explicit UTC offset, e.g. `2026-06-02T15:00:00-07:00`."
    + " Always include the UTC offset — do not assume UTC; using the wrong offset will place the override in the wrong time slot."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/41d0a7c3c3a01-create-one-or-more-overrides)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    scheduleId: {
      type: "string",
      label: "Schedule ID",
      description: "The ID of the schedule to override. Use **List Schedules** to discover IDs.",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The ID of the user to assign for the override window. Use **List Users** to find IDs.",
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start of the override window (ISO 8601 with UTC offset, e.g. `2026-06-02T08:00:00-07:00`).",
    },
    end: {
      type: "string",
      label: "End",
      description: "End of the override window (ISO 8601 with UTC offset, e.g. `2026-06-02T16:00:00-07:00`).",
    },
  },
  async run({ $ }) {
    const response = await this.app.createScheduleOverride({
      $,
      scheduleId: this.scheduleId,
      data: {
        overrides: [
          {
            start: this.start,
            end: this.end,
            user: {
              id: this.userId,
              type: "user_reference",
            },
          },
        ],
      },
    });

    $.export("$summary", `Created schedule override on schedule ${this.scheduleId} for user ${this.userId} from ${this.start} to ${this.end}`);
    return response;
  },
};
