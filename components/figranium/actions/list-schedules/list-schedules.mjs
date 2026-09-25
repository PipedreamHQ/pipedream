import app from "../../figranium.app.mjs";

export default {
  key: "figranium-list-schedules",
  name: "List Schedules",
  description: "Return all tasks that have schedules configured. [See the documentation](https://figranium.com/docs/api-authentication-and-secure-access).",
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
    const response = await this.app.listSchedules({
      $,
    });

    $.export("$summary", "Successfully retrieved schedules.");
    return response;
  },
};
