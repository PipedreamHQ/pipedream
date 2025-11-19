import app from "../../xola.app.mjs";

export default {
  key: "xola-delete-experience-schedule",
  name: "Delete Experience Schedule",
  description: "Deletes a schedule from an experience. [See the documentation](https://xola.github.io/xola-docs/#tag/schedules/operation/deleteExperienceSchedule)",
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
  },
  async run({ $ }) {
    const {
      app,
      experienceId,
      scheduleId,
    } = this;

    await app.deleteExperienceSchedule({
      $,
      experienceId,
      scheduleId,
    });

    $.export("$summary", "Successfully deleted schedule");
    return {
      success: true,
    };
  },
};
