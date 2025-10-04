import { readFileSync } from "fs";
import app from "../../leexi.app.mjs";

export default {
  key: "leexi-create-presign-recording-url",
  name: "Create Presigned Recording URL",
  description: "Creates a presigned URL for uploading a call recording. [See the documentation](https://developer.leexi.ai/)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    extension: {
      propDefinition: [
        app,
        "extension",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file to upload. Eg. `/tmp/recording.mp3`",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    createPresignedRecordingUrl(args = {}) {
      return this.app.post({
        path: "/calls/presign_recording_url",
        ...args,
      });
    },
    uploadFile(args = {}) {
      return this.app.put({
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      uploadFile,
      createPresignedRecordingUrl,
      extension,
      filePath,
    } = this;

    const response = await createPresignedRecordingUrl({
      $,
      data: {
        extension,
      },
    });

    if (!response.success) {
      $.export("$error", "Failed to create a presigned URL for recording.");
      return response;
    }

    const {
      data: {
        headers,
        url,
      },
    } = response;

    const path = filePath?.startsWith("/tmp")
      ? filePath
      : `/tmp/${filePath}`;

    await uploadFile({
      $,
      headers,
      url,
      data: readFileSync(path),
    });

    $.export("$summary", "Successfully created a presigned URL for recording");
    return response;
  },
};
