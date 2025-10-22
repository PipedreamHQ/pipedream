import app from "../../xola.app.mjs";

export default {
  key: "xola-create-experience-schedule",
  name: "Create Experience Schedule",
  description: "Creates a new schedule for an experience. [See the documentation](https://xola.github.io/xola-docs/#tag/schedules/operation/createExperienceSchedule)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sellerId: {
      propDefinition: [
        app,
        "sellerId",
      ],
      async options() {
        const {
          id: value,
          name: label,
        } = await this.getUser();
        return [
          {
            label,
            value,
          },
        ];
      },
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
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    type: {
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
