import app from "../../speak_ai.app.mjs";

export default {
  key: "speak_ai-upload-media",
  name: "Upload Media",
  description: "Upload an audio or video file for transcription and natural language processing into Speak AI. [See the documentation](https://docs.speakai.co/#c6106a66-6a3d-4b05-b4a2-4a68a4c1e95d).",
  version: "0.0.2",
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
