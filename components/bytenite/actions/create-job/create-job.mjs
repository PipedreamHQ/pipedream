import bytenite from "../../bytenite.app.mjs";

export default {
  key: "bytenite-create-job",
  name: "Create Video Encoding Task",
  description: "Creates a new video encoding task with ByteNite. [See the documentation](https://docs.bytenite.com/docs/video-transcoding-introduction)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    bytenite,
    videoLink: {
      propDefinition: [
        bytenite,
        "videoLink",
      ],
    },
    encodingQuality: {
      propDefinition: [
        bytenite,
        "encodingQuality",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bytenite.createVideoEncodingTask({
      videoLink: this.videoLink,
      encodingQuality: this.encodingQuality,
    });
    $.export("$summary", `Successfully created video encoding task with ID: ${response.id}`);
    return response;
  },
};
