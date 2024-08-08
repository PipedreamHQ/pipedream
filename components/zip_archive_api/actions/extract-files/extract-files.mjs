import app from "../../zip_archive_api.app.mjs";

export default {
  key: "zip_archive_api-extract-files",
  name: "Extract Files",
  description: "Extract the files from an archive. [See the documentation](https://archiveapi.com/rest-api/archive-extraction/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    app,
    file: {
      propDefinition: [
        app,
        "file",
      ],
    },
    password: {
      propDefinition: [
        app,
        "password",
      ],
    },
    folder: {
      type: "string",
      label: "Folder",
      description: "Folder to extract the files to",
    },
  },
  async run({ $ }) {
    const response = await this.app.extractFiles({
      $,
      data: {
        file: this.file,
        password: this.password,
      },
    });

    $.export("$summary", "Successfully extracted the files from the specified archive");

    return response;
  },
};
