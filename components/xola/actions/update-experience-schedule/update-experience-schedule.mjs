import app from "../../xola.app.mjs";

export default {
  key: "xola-update-experience-schedule",
  name: "Update Experience Schedule",
  description: "Updates an existing schedule for an experience. [See the documentation](https://xola.github.io/xola-docs/#tag/schedules/operation/updateExperienceSchedule)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sellerId: {
      label: "Seller ID",
      description: "The unique identifier of the seller",
      propDefinition: [
        app,
        "userId",
      ],
    },
    experienceId: {
      propDefinition: [
        app,
        "experienceId",
        ({ sellerId }) => ({
          sellerId,
        }),
      ],
    },
    scheduleId: {
      propDefinition: [
        app,
        "scheduleId",
        ({ experienceId }) => ({
          experienceId,
        }),
      ],
    },
    name: {
      optional: true,
      propDefinition: [
        app,
        "name",
      ],
    },
    type: {
      optional: true,
      propDefinition: [
        app,
        "type",
      ],
    },
    days: {
      propDefinition: [
        app,
        "days",
      ],
    },
    departure: {
      propDefinition: [
        app,
        "departure",
      ],
    },
    times: {
      propDefinition: [
        app,
        "times",
      ],
    },
    priceDelta: {
      propDefinition: [
        app,
        "priceDelta",
      ],
    },
    repeat: {
      propDefinition: [
        app,
        "repeat",
      ],
    },
    start: {
      propDefinition: [
        app,
        "start",
      ],
    },
    end: {
      propDefinition: [
        app,
        "end",
      ],
    },
    dates: {
      propDefinition: [
        app,
        "dates",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      experienceId,
      scheduleId,
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

    const response = await app.updateExperienceSchedule({
      $,
      experienceId,
      scheduleId,
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

    $.export("$summary", `Successfully updated schedule \`${scheduleId}\` for experience with ID \`${experienceId}\``);
    return response;
  },
};
