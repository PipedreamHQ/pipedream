import app from "../../robopost.app.mjs";

export default {
  key: "robopost-generate-video",
  name: "Generate Video",
  description: "Create a new video generation task from a video series. [See the documentation](https://robopost.app/docs/robopost-api/#videogenerationtasks)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    configurationId: {
      propDefinition: [
        app,
        "configurationId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.generateVideo({
      $,
      configurationId: this.configurationId,
    });
    $.export("$summary", `Successfully started the task to generate the video. Task ID: ${response.task_id}`);
    return response;
  },
};
