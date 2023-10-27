import { ConfigurationError } from "@pipedream/platform";
import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import spotlightr from "../../spotlightr.app.mjs";

export default {
  key: "spotlightr-create-video",
  name: "Create Video",
  version: "0.0.1",
  description: "Create a video in an application. [See the documentation](https://app.spotlightr.com/docs/api/#create-video)",
  type: "action",
  props: {
    spotlightr,
    url: {
      type: "string",
      label: "URL",
      description: "The video URL. `You must provide at least the URL or File.`",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the video.",
    },
    customS3: {
      type: "string",
      label: "Custom S3",
      description: "**0** or **ID** of custom integration.",
      default: "0",
    },
    hls: {
      type: "integer",
      label: "HLS",
      description: "The media streaming protocol.",
      options: [
        {
          label: "To leave as unsecured.",
          value: 0,
        },
        {
          label: "To encode.",
          value: 1,
        },
      ],
      optional: true,
    },
    videoGroup: {
      propDefinition: [
        spotlightr,
        "videoGroup",
      ],
      optional: true,
    },
    create: {
      type: "integer",
      label: "Create",
      description: "The type of the creation.",
      options: [
        {
          label: "To debug.",
          value: 0,
        },
        {
          label: "To confirm.",
          value: 1,
        },
      ],
      optional: true,
    },
    playerSettings: {
      type: "object",
      label: "Player Settings",
      description: "Video ID for coping playerSettings (decoded base64)",
      optional: true,
    },
    file: {
      type: "string",
      label: "File",
      description: "Full path to the file in `/tmp/` directory. E.g. `/tmp/video.mp4`. `You must provide at least the URL or File.`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spotlightr,
      url,
      file,
      ...data
    } = this;

    if (!file && !url) {
      throw new ConfigurationError("You must provide at least the URL or File.");
    }

    let preparedData = {};
    if (file) {
      const formData = new FormData();

      const path = checkTmp(file);
      if (!fs.existsSync(path)) {
        throw new ConfigurationError("File does not exist!");
      }

      formData.append("file", fs.createReadStream(path));
      for (const [
        key,
        value,
      ] of Object.entries(data)) {
        formData.append(key, value);
      }

      preparedData = {
        formDataRequest: true,
        headers: formData.getHeaders(),
        data: formData,
      };

    } else {
      preparedData = {
        data: {
          URL: url,
          ...data,
        },
      };
    }

    const response = await spotlightr.createVideo({
      $,
      ...preparedData,
    });

    $.export("$summary", `A new video with ${response.data
      ? `URL: ${response.data}`
      : `Id: ${response}`} was successfully created!`);
    return response.data || response;
  },
};
