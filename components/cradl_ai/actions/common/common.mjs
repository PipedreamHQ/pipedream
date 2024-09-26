import cradlAi from "../../cradl_ai.app.mjs";
import constants from "../../common/constants.mjs";
import fs from "fs";

export default {
  props: {
    cradlAi,
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the document file saved to the `/tmp` directory (e.g. `/tmp/example.pdf`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The content type of the document",
      options: constants.CONTENT_TYPES,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the document",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the document",
      optional: true,
    },
    datasetId: {
      propDefinition: [
        cradlAi,
        "datasetId",
      ],
    },
  },
  methods: {
    createDocumentHandle($) {
      return this.cradlAi.createDocumentHandle({
        $,
        data: {
          name: this.name,
          description: this.description,
          datasetId: this.datasetId,
        },
      });
    },
    uploadFile($, fileUrl) {
      const fileData = fs.readFileSync(this.filePath.includes("/tmp")
        ? this.filePath
        : `/tmp/${this.filePath}`);
      return this.cradlAi.uploadDocument({
        $,
        fileUrl,
        data: fileData,
        headers: {
          "Content-Type": this.contentType,
        },
      });
    },
  },
};
