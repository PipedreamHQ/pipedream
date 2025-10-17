import app from "../../xola.app.mjs";

export default {
  key: "xola-delete-experience-schedule",
  name: "Delete Experience Schedule",
  description: "Deletes a schedule from an experience. [See the documentation](https://xola.github.io/xola-docs/#tag/schedules/operation/deleteExperienceSchedule)",
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
  },
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    const {
      app,
      experienceId,
      scheduleId,
    } = this;

    const response = await app.deleteExperienceSchedule({
      $,
      experienceId,
      scheduleId,
    });

    $.export("$summary", `Successfully deleted schedule ${scheduleId}`);
    return response;
  },
};
