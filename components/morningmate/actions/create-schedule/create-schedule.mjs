import morningmate from "../../morningmate.app.mjs";

export default {
  key: "morningmate-create-schedule",
  name: "Create Schedule",
  description: "Creates a new schedule for a specific project. [See the documentation](https://api.morningmate.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    morningmate,
    projectId: {
      propDefinition: [
        morningmate,
        "projectId",
      ],
    },
    scheduleTime: {
      propDefinition: [
        morningmate,
        "scheduleTime",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.morningmate.createSchedule({
      projectId: this.projectId,
      scheduleTime: this.scheduleTime,
    });
    $.export("$summary", `Successfully created schedule for project ID ${this.projectId}`);
    return response;
  },
};
