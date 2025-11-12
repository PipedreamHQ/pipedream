import bannerbear from "../../bannerbear.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "bannerbear-create-video",
  name: "Create Video",
  description: "Creates a Video. [See the docs here](https://developers.bannerbear.com/#post-v2-videos).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    bannerbear,
    videoTemplate: {
      propDefinition: [
        bannerbear,
        "videoTemplateUid",
      ],
    },
    modifications: {
      propDefinition: [
        bannerbear,
        "modifications",
      ],
    },
    inputMediaUrl: {
      propDefinition: [
        bannerbear,
        "inputMediaUrl",
      ],
    },
    zoom: {
      type: "string",
      label: "Zoom",
      description: "Apply a panning zoom effect to the video or image, can be one of: center, top, right, bottom, left.",
      optional: true,
      options: [
        "center",
        "top",
        "right",
        "bottom",
        "left",
      ],
    },
    zoomFactor: {
      type: "integer",
      label: "Zoom Factor",
      description: "Amount to zoom in by from `1` to `100`. If **Zoom** is set and **Zoom Factor** is left blank, this will default to `10`.",
      min: 1,
      max: 100,
      optional: true,
    },
    blur: {
      type: "integer",
      label: "Blur",
      description: "Apply a blur filter (from `1` to `10`) to the incoming video.",
      min: 1,
      max: 10,
      optional: true,
    },
    trimStartTime: {
      type: "string",
      label: "Trim Start Time",
      description: "Trim the **Input Media URL** clip to a specific start point, using `HH:MM:SS` notation.",
      optional: true,
    },
    trimEndTime: {
      type: "string",
      label: "Trim End Time",
      description: "Trim the **Input Media URL** clip to a specific end point, using `HH:MM:SS` notation.",
      optional: true,
    },
    trimToLengthInSeconds: {
      type: "integer",
      label: "Trim To Length In Seconds",
      description: "Force trim the end video to a specific time. There are two ways to trim videos, either you use **Trim To Length In Seconds** to trim from the start point by specifying a desired length. Or you can use **Trim Start Time** and **Trim End Time** to specify a part of the video / audio to be used.",
      optional: true,
    },
    webhookUrl: {
      propDefinition: [
        bannerbear,
        "webhookUrl",
      ],
      description: "A url to POST the full Video object to upon rendering completed",
    },
    metadata: {
      propDefinition: [
        bannerbear,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const {
      videoTemplate,
      inputMediaUrl,
      zoom,
      zoomFactor,
      blur,
      trimStartTime,
      trimEndTime,
      trimToLengthInSeconds,
      webhookUrl,
      metadata,
    } = this;

    const modifications = utils.parse(this.modifications);

    const response = await this.bannerbear.createVideo({
      $,
      data: {
        video_template: videoTemplate,
        modifications,
        input_media_url: inputMediaUrl,
        zoom,
        zoom_factor: zoomFactor,
        blur,
        trim_start_time: trimStartTime,
        trim_end_time: trimEndTime,
        trim_to_length_in_seconds: trimToLengthInSeconds,
        webhook_url: webhookUrl,
        metadata,
      },
    });

    $.export("$summary", `Successfully created video with UID ${response.uid}`);

    return response;
  },
};
