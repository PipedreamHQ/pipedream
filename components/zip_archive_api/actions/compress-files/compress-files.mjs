import app from "../../zip_archive_api.app.mjs";
import fs from "fs";
import FormData from "form-data";

export default {
  key: "zip_archive_api-compress-files",
  name: "Compress Files",
  description: "Compress files provided through URLs into a zip folder. [See the documentation](https://archiveapi.com/rest-api/file-compression/)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    uploadType: {
      propDefinition: [
        app,
        "uploadType",
      ],
    },
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
  },
  async run({ $ }) {
    let data = {
      files: this.files,
      archiveName: this.archiveName,
      compressionLevel: this.compressionLevel,
      password: this.password,
    };

    if (this.uploadType === "File") {
      data = new FormData();

      if (this.password) data.append("Password", this.password);
      if (this.compressionLevel) data.append("CompressionLevel", this.compressionLevel);
      data.append("ArchiveName", this.archiveName);

      for (const file of this.files) {
        data.append("Files", fs.createReadStream(file));
      }
    }

    const headers = this.uploadType === "File"
      ? data.getHeaders()
      : {};

    const response = await this.app.compressFiles({
      $,
      data,
      headers,
      responseType: "arraybuffer",
    });

    const tmpPath = `/tmp/${this.archiveName}`;
    fs.writeFileSync(tmpPath, response);

    $.export("$summary", `Successfully compressed the files into '${tmpPath}'`);

    return tmpPath;
  },
};
