import trint from "../../trint.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import languages from "../../common/languages.mjs";

export default {
  key: "trint-upload-file",
  name: "Upload File",
  description: "Upload media files directly to Trint for immediate transcription. [See the documentation](https://dev.trint.com/reference/upload)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    trint,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.mp4`)",
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language to transcribe",
      options: languages,
      optional: true,
    },
    detectSpeakerChange: {
      type: "boolean",
      label: "Detect Speaker Change",
      description: "Automatically split paragraphs based on change of speaker. If the parameter is not specified it default to `true`.",
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        trint,
        "workspaceId",
      ],
      optional: true,
    },
    folderId: {
      propDefinition: [
        trint,
        "folderId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
      optional: true,
    },
    customDictionary: {
      type: "boolean",
      label: "Custom Dictionary",
      description: "Use the Vocab Builder during the transcription of the file. If the parameter is not specified it default to `true`.",
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    streamToBuffer(stream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    const fileBinary = await this.streamToBuffer(stream);

    const response = await this.trint.uploadFile({
      $,
      params: {
        "filename": metadata.name,
        "language": this.language,
        "detect-speaker-change": this.detectSpeakerChange,
        "custom-dictionary": this.customDictionary,
        "workspace-id": this.workspaceId,
        "folder-id": this.folderId,
      },
      headers: {
        "Content-Type": metadata.contentType || "application/octet-stream",
      },
      data: Buffer.from(fileBinary, "binary"),
    });

    $.export("$summary", `Successfully uploaded file to Trint: ${response.trintId}`);
    return response;
  },
};
