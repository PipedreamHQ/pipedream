import app from "../../maestra.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "maestra-upload-file",
  name: "Upload File",
  description: "Initiates a new file upload to Maestra. [See the documentation](https://maestra.ai/docs#uploadFile)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    fileUrl: {
      propDefinition: [
        app,
        "fileUrl",
      ],
    },
    fileName: {
      type: "string",
      label: "File Name",
      description: "The name of the file to upload",
    },
    mediaType: {
      type: "string",
      label: "Media Type",
      description: "The media type of the file, e.g., `video/mp4`",
      default: "video/mp4",
    },
    audioLanguage: {
      type: "string",
      label: "Audio Language",
      description: "The language of the audio in the file, e.g., `en-US`",
      default: "en-US",
    },
    speakerCount: {
      type: "integer",
      label: "Speaker Count",
      description: "The number of speakers in the file, e.g., `2`",
      optional: true,
    },
    dictionaryKey: {
      type: "string",
      label: "Dictionary Key",
      description: "The dictionary key to use for the file, e.g., `default`",
      optional: true,
    },
    channelId: {
      propDefinition: [
        app,
        "channelId",
      ],
    },
    folderPath: {
      propDefinition: [
        app,
        "folderPath",
      ],
    },
    operationType: {
      optional: true,
      propDefinition: [
        app,
        "operationType",
      ],
    },
    skipTranscription: {
      type: "boolean",
      label: "Skip Transcription",
      description: "Set to true to skip transcription, false otherwise",
      optional: true,
    },
    targetLanguages: {
      optional: true,
      propDefinition: [
        app,
        "targetLanguages",
      ],
    },
  },
  methods: {
    uploadFile(args = {}) {
      return this.app.post({
        path: "/uploadFile",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      uploadFile,
      targetLanguages,
      ...data
    } = this;

    const response = await uploadFile({
      $,
      data: {
        ...data,
        targetLanguages: utils.arrayToObj(targetLanguages),
      },
    });

    $.export("$summary", `Successfully uploaded file with ID \`${response.fileId}\``);

    return response;
  },
};
