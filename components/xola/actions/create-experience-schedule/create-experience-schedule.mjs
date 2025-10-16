import app from "../../xola.app.mjs";

export default {
  key: "xola-create-experience-schedule",
  name: "Create Experience Schedule",
  description: "Creates a new schedule for an experience. [See the documentation](https://developers.xola.com/reference/create-an-experience)",
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
    name: {
      type: "string",
      label: "Name",
      description: "Name for this schedule",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Can be for an open (`available`) schedule or a `blackout` schedule",
      options: [
        "available",
        "blackout",
      ],
    },
    days: {
      type: "string[]",
      label: "Days",
      description: "Days of week",
      optional: true,
      options: [
        {
          label: "Sunday",
          value: "0",
        },
        {
          label: "Monday",
          value: "1",
        },
        {
          label: "Tuesday",
          value: "2",
        },
        {
          label: "Wednesday",
          value: "3",
        },
        {
          label: "Thursday",
          value: "4",
        },
        {
          label: "Friday",
          value: "5",
        },
        {
          label: "Saturday",
          value: "6",
        },
      ],
    },
    departure: {
      type: "string",
      label: "Departure",
      description: "Whether departure time is fixed or varies",
      options: [
        "fixed",
        "varies",
      ],
      optional: true,
    },
    times: {
      type: "string[]",
      label: "Times",
      description: "Start times in HHMM format (e.g., `900` = 9:00 AM, `1400` = 2:00 PM, `1800` = 6:00 PM).",
      options: [
        {
          label: "9:00 AM",
          value: "900",
        },
        {
          label: "2:00 PM",
          value: "1400",
        },
        {
          label: "6:00 PM",
          value: "1800",
        },
      ],
      optional: true,
    },
    priceDelta: {
      type: "string",
      label: "Price Delta",
      description: "Price adjustment for this schedule (can be positive or negative). Only available when **Type** is `available`",
      optional: true,
    },
    repeat: {
      type: "string",
      label: "Repeat",
      description: "When and how the schedule should repeat. Options are `weekly` (repeat the same schedule every week until **End**, if specified), or custom, which can be used in conjunction with **Dates** to specify individual days for the schedule to run",
      optional: true,
      options: [
        "weekly",
        "custom",
      ],
    },
    start: {
      type: "string",
      label: "Start",
      description: "Start date of the schedule in ISO 8601 format. Example: `2024-01-01T00:00:00Z`",
      optional: true,
    },
    end: {
      type: "string",
      label: "End",
      description: "End date of the schedule in ISO 8601 format. Example: `2024-12-31T23:59:59Z`",
      optional: true,
    },
    dates: {
      type: "string[]",
      label: "Dates",
      description: "Specific dates when this schedule applies. Only available when **Repeat** is `custom`. Format is `YYYY-MM-DD`. Cannot be combined with **End**.",
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
      name,
      type,
      days,
      times,
      departure,
      priceDelta,
      repeat,
      start,
      end,
      dates,
    } = this;

    const response = await app.createExperienceSchedule({
      $,
      experienceId,
      data: {
        start,
        end,
        dates,
        type,
        name,
        repeat,
        days,
        times,
        departure,
        priceDelta,
      },
    });

    $.export("$summary", `Successfully created schedule for experience with ID \`${response.id}\``);
    return response;
  },
};
