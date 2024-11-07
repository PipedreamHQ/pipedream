import lokalise from "../../lokalise.app.mjs";
import fs from "fs";
import path from "path";

export default {
  key: "lokalise-upload-file",
  name: "Upload File",
  description: "Uploads a specified file to a Lokalise project",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    lokalise,
    projectId: {
      propDefinition: [
        lokalise,
        "projectId",
      ],
    },
    filePath: {
      propDefinition: [
        lokalise,
        "filePath",
      ],
    },
    langIso: {
      type: "string",
      label: "Language ISO",
      description: "Language code of the translations in the file you are importing",
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "Set the filename. You may optionally use a relative path in the filename",
    },
  },
  async run({ $ }) {
    const fileData = fs.readFileSync(path.resolve(this.filePath), {
      encoding: "base64",
    });
    const response = await this.lokalise.uploadFile({
      data: {
        data: fileData,
        filename: this.filename,
        lang_iso: this.langIso,
      },
    });
    $.export("$summary", "Successfully uploaded file");
    return response;
  },
};
