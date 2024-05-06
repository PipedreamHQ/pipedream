import app from "../../zip_archive_api.app.mjs";

export default {
  key: "zip_archive_api-compress-files",
  name: "Compress Files",
  description: "Compress files provided through URLs into a zip folder. [See the documentation](https://archiveapi.com/rest-api/file-compression/)",
  version: "0.0.1",
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
  },
  async run({ $ }) {
    const response = await this.app.compressFiles({
      $,
      data: {
        archiveName: this.archiveName,
        compressionLevel: this.compressionLevel,
        password: this.password,
        files: this.files,
      },
    });

    $.export("$summary", `Successfully compressed the files into '${this.archiveName}.zip'`);

    return response;
  },
};
