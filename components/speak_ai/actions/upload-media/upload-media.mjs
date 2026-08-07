import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-upload-media",
  name: "Upload Media",
  description: "Upload an audio or video file to Speak AI for transcription and analysis, from a publicly reachable URL or an AWS signed URL. Processing is asynchronous, so use the **New Automated Transcription (Instant)** trigger to act on the result. [See the documentation](https://docs.speakai.co/api/media/#post-media-upload).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "Name of the media file",
    },
    url: {
      type: "string",
      label: "URL",
      description: "Public URL or AWS signed URL",
    },
    mediaType: {
      propDefinition: [
        app,
        "mediaType",
      ],
    },
    folderId: {
      propDefinition: [
        app,
        "folderId",
      ],
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the media file",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Optional metadata tags for the media file upload",
      optional: true,
    },
  },
  methods: {
    uploadMedia(args = {}) {
      return this.app.post({
        path: "/media/upload",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadMedia,
      name,
      url,
      mediaType,
      folderId,
      description,
      tags,
    } = this;

    const response = await uploadMedia({
      $,
      data: {
        name,
        url,
        mediaType,
        folderId,
        description,
        tags: Array.isArray(tags)
          ? tags.join(",")
          : tags,
      },
    });

    $.export("$summary", `Successfully uploaded media with ID \`${response.data.mediaId}\`.`);
    return response;
  },
};
