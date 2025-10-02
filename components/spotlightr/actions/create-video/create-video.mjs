import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";
import spotlightr from "../../spotlightr.app.mjs";

export default {
  key: "spotlightr-create-video",
  name: "Create Video",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a video in an application. [See the documentation](https://app.spotlightr.com/docs/api/#create-video)",
  type: "action",
  props: {
    spotlightr,
    file: {
      type: "string",
      label: "File Path or URL",
      description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      spotlightr,
      file,
      ...data
    } = this;

    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(file);

    const formData = new FormData();

    formData.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    for (const [
      key,
      value,
    ] of Object.entries(data)) {
      formData.append(key, value);
    }

    const preparedData = {
      formDataRequest: true,
      headers: formData.getHeaders(),
      data: formData,
    };

    const response = await spotlightr.createVideo({
      $,
      ...preparedData,
    });

    $.export("$summary", "New video successfully created!");
    return response.data || response;
  },
};
