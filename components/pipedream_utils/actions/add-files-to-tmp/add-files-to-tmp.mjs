import pipedream_utils from "../../pipedream_utils.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "pipedream_utils-add-files-to-tmp",
  name: "Add Files To /tmp",
  description: "Adds a list of files to [your workflow's /tmp directory](https://pipedream.com/docs/code/nodejs/working-with-files/#the-tmp-directory)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    pipedream_utils,
    files: {
      type: "string[]",
      label: "Files",
      description: "An array of File URLs or base64-encoded file contents",
      format: "file-ref",
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
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
    const files = [];
    for (const file of this.files) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);
      const buffer = await this.streamToBuffer(stream);
      const filename = metadata.name || `file_${Date.now()}`;
      const filepath = `/tmp/${filename}`;
      fs.writeFileSync(filepath, buffer);
      files.push({
        filename,
        filepath,
      });
    }
    $.export("$summary", `Successfully added ${files.length} files to /tmp`);
    return files;
  },
};
