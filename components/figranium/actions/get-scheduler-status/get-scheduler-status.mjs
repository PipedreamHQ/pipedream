import app from "../../figranium.app.mjs";

export default {
  key: "figranium-get-scheduler-status",
  name: "Get Scheduler Status",
  description: "Return the overall status of the task scheduler. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getAllScheduleStatus({
      $,
    });

    $.export("$summary", "Successfully retrieved scheduler status.");
    return response;
  },
};
