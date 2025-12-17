import app from "../../zip_archive_api.app.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "zip_archive_api-compress-files",
  name: "Compress Files",
  description: "Compress files provided through URLs into a zip folder. [See the documentation](https://archiveapi.com/rest-api/file-compression/)",
  version: "1.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    archiveName: {
      propDefinition: [
        app,
        "archiveName",
      ],
    },
    compressionLevel: {
      propDefinition: [
        app,
        "compressionLevel",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
    },
    files: {
      propDefinition: [
        app,
        "files",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read-write",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();

    if (this.password) data.append("Password", this.password);
    if (this.compressionLevel) data.append("CompressionLevel", this.compressionLevel);
    data.append("ArchiveName", this.archiveName);

    for (const file of this.files) {
      const {
        stream, metadata,
      } = await getFileStreamAndMetadata(file);
      data.append("Files", stream, {
        contentType: metadata.contentType,
        knownLength: metadata.size,
        filename: metadata.name,
      });
    }

    const response = await this.app.compressFiles({
      $,
      data,
      headers: data.getHeaders(),
      responseType: "arraybuffer",
    });

    const tmpPath = `/tmp/${this.archiveName}`;
    fs.writeFileSync(tmpPath, response);

    $.export("$summary", `Successfully compressed the files into '${tmpPath}'`);

    return tmpPath;
  },
};
