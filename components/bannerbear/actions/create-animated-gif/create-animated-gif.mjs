import bannerbear from "../../bannerbear.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bannerbear-create-animated-gif",
  name: "Create Animated Gif",
  description: "Creates an Animated Gif. [See the docs here](https://developers.bannerbear.com/#post-v2-animated_gifs).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bannerbear,
    template: {
      propDefinition: [
        bannerbear,
        "templateUid",
      ],
    },
    frames: {
      propDefinition: [
        bannerbear,
        "frames",
      ],
    },
    inputMediaUrl: {
      propDefinition: [
        bannerbear,
        "inputMediaUrl",
      ],
      description: "An optional movie file that can be used as part of the gif. Depending on the number of frames you pass in, Bannerbear will generate thumbnails of this movie and place them sequentially into an image container in your template named `video_frame`.",
      optional: true,
    },
    fps: {
      type: "integer",
      label: "FPS",
      description: "Set the frame rate of gif (default is `1` frame per second).",
      optional: true,
    },
    frameDurations: {
      type: "string[]",
      label: "Frame Durations",
      description: "Custom durations for each frame (overrides fps).",
      optional: true,
    },
    loop: {
      type: "boolean",
      label: "Loop",
      description: "Set the gif to loop or only play once.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        bannerbear,
        "metadata",
      ],
    },
    webhookUrl: {
      propDefinition: [
        bannerbear,
        "webhookUrl",
      ],
    },
  },
  async run({ $ }) {
    const {
      template,
      inputMediaUrl,
      fps,
      loop,
      metadata,
      webhookUrl,
    } = this;

    const frames = utils.parse(this.frames);
    const frameDurations = utils.parse(this.frameDurations);

    const response = await this.bannerbear.createAnimatedGif({
      $,
      data: {
        template,
        frames,
        input_media_url: inputMediaUrl,
        fps,
        frame_durations: frameDurations,
        loop,
        webhook_url: webhookUrl,
        metadata,
      },
    });

    $.export("$summary", `Successfully created animated gif with UID ${response.uid}`);

    return response;
  },
};
