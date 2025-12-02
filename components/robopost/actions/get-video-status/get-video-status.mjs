import app from "../../robopost.app.mjs";

export default {
  key: "robopost-get-video-status",
  name: "Get Video Status",
  description: "Check the status of a video generation task. [See the documentation](https://robopost.app/docs/robopost-api/#videogenerationtasks)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    taskId: {
      propDefinition: [
        app,
        "taskId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getVideoStatus({
      $,
      taskId: this.taskId,
    });
    $.export("$summary", `The task status is: ${response.status}`);
    return response;
  },
};
