import cradlAi from "../../cradl_ai.app.mjs";
import constants from "../../common/constants.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  props: {
    cradlAi,
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to process. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`).",
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
    async uploadFile($, fileUrl) {
      const fileData = await getFileStream(this.filePath);
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
