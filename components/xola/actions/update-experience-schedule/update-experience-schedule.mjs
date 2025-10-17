import app from "../../xola.app.mjs";

export default {
  key: "xola-update-experience-schedule",
  name: "Update Experience Schedule",
  description: "Updates an existing schedule for an experience. [See the documentation](https://xola.github.io/xola-docs/#tag/schedules/operation/updateExperienceSchedule)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    experienceId: {
      propDefinition: [
        app,
        "experienceId",
      ],
    },
    scheduleId: {
      propDefinition: [
        app,
        "scheduleId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the schedule",
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of schedule",
      options: [
        "available",
        "unavailable",
      ],
      optional: true,
    },
    repeat: {
      type: "string",
      label: "Repeat",
      description: "How often the schedule repeats",
      options: [
        "daily",
        "weekly",
        "monthly",
      ],
      optional: true,
    },
    days: {
      type: "integer[]",
      label: "Days",
      description: "Days of the week (1-7, where 1 is Monday). Example: `[1, 2, 3]` for Monday through Wednesday",
      optional: true,
    },
    start: {
      type: "string",
      label: "Start Date",
      description: "Start date in ISO 8601 format. Example: `2024-01-01T00:00:00Z`",
      optional: true,
    },
    end: {
      type: "string",
      label: "End Date",
      description: "End date in ISO 8601 format. Example: `2024-12-31T23:59:59Z`",
      optional: true,
    },
    times: {
      type: "string[]",
      label: "Times",
      description: "Array of time slots. Example: `[\"09:00\", \"14:00\"]`",
      optional: true,
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    const {
      app,
      experienceId,
      scheduleId,
      name,
      type,
      repeat,
      days,
      start,
      end,
      times,
    } = this;

    const response = await app.updateExperienceSchedule({
      $,
      experienceId,
      scheduleId,
      data: {
        ...name && {
          name,
        },
        ...type && {
          type,
        },
        ...repeat && {
          repeat,
        },
        ...days && {
          days,
        },
        ...start && {
          start,
        },
        ...end && {
          end,
        },
        ...times && {
          times,
        },
      },
    });

    $.export("$summary", `Successfully updated schedule ${scheduleId}`);
    return response;
  },
};
