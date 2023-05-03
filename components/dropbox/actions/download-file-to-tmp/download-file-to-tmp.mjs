import dropbox from "../../dropbox.app.mjs";
import common from "../common/common.mjs";
import fs from "fs";
import { file } from "tmp-promise";

export default {
  ...common,
  name: "Download File To TMP",
  description: "Download a specific file to the temporary directory. [See docs here](https://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesDownload__anchor)",
  key: "dropbox-download-file-to-tmp",
  version: "0.0.11",
  type: "action",
  props: {
    dropbox,
    path: {
      propDefinition: [
        dropbox,
        "pathFolder",
      ],
      description: "The file path in the user's Dropbox to download.",
    },
    name: {
      type: "string",
      label: "File name",
      description: "The new name of the file to be saved, including it's extension. e.g: `myFile.csv`",
    },
  },
  async run({ $ }) {
    const { result } = await this.dropbox.downloadFile({
      path: this.getNormalizedPath(this.path, true) + this.name,
    });

    const { cleanup } = await file();
    await fs.promises.appendFile(`/tmp/${result.name}`, Buffer.from(result.fileBinary));
    await cleanup();

    delete result.fileBinary;

    $.export("$summary", `File successfully saved in "${this.path.label}"`);

    return {
      tmpPath: `/tmp/${result.name}`,
      ...result,
    };
  },
};
