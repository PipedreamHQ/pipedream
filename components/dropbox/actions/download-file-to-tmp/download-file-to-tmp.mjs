import dropbox from "../../dropbox.app.mjs";
import fs from "fs";
import { file } from "tmp-promise";

export default {
  name: "Download File to TMP",
  description: "Download a specific file to the temporary directory. [See the documentation](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesDownload__anchor).",
  key: "dropbox-download-file-to-tmp",
  version: "0.0.5",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "path",
        () => ({
          initialOptions: [],
        }),
      ],
    },
    name: {
      type: "string",
      label: "File name",
      description: "The new name of the file to be saved, including it's extension. e.g: `myFile.csv`",
      optional: true,
    },
  },
  async run({ $ }) {
    const { result } = await this.dropbox.downloadFile({
      path: this.dropbox.getNormalizedPath(this.path, false),
    });

    const {
      path, cleanup,
    } = await file();

    const tmpPath = this.name
      ? `/tmp/${this.name}`
      : path;

    await fs.promises.appendFile(tmpPath, Buffer.from(result.fileBinary));
    await cleanup();

    delete result.fileBinary;

    $.export("$summary", `File successfully saved in "/tmp/${this.name}"`);

    return {
      tmpPath,
      ...result,
    };
  },
};
