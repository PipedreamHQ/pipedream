import reform from "../../reform.app.mjs";
import utils from "../common/utils.mjs";
import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "reform-extract-data-from-document",
  name: "Extract Data From Document",
  description: "Extract structured data from a document. [See the documentation](https://docs.reformhq.com/synchronous-data-processing/extract)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    reform,
    document: {
      propDefinition: [
        reform,
        "document",
      ],
    },
    fields: {
      propDefinition: [
        reform,
        "fields",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = utils.parseFields(this.fields);
    const formData = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.document);
    formData.append("document", stream, {
      filename: metadata.name,
      contentType: metadata.contentType,
      knownLength: metadata.size,
    });
    formData.append("fields_to_extract", JSON.stringify(fields));

    const response = await this.reform.extractDataFromDocument({
      $,
      data: formData,
    });

    $.export("$summary", "Successfully extracted data from document.");

    return response;
  },
};
