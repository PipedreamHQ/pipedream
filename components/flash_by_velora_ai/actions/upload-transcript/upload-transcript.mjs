import app from "../../flash_by_velora_ai.app.mjs";

export default {
  key: "flash_by_velora_ai-upload-transcript",
  name: "Upload Transcript",
  description: "Upload a meeting transcript.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Meeting Title",
      description: "Title of the meeting.",
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "Transcript file (supported types: **text/plain**, **pdf**, **vtt**) or transcript text.",
    },
    sourceType: {
      type: "string",
      label: "Source Type",
      description: "Type of the source system of the file, for example, `Google Drive`, `Fireflies.ai`, etc.",
    },
  },
  methods: {
    uploadTranscript(args = {}) {
      return this.app.post({
        path: "/upload-transcript",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadTranscript,
      title,
      fileUrl,
      sourceType,
    } = this;

    const response = await uploadTranscript({
      $,
      data: {
        title,
        file_url: fileUrl,
        source_type: sourceType,
      },
    });

    $.export("$summary", "Successfully uploaded transcript.");
    return response;
  },
};
