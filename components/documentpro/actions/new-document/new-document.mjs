import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import documentpro from "../../documentpro.app.mjs";

export default {
  key: "documentpro-new-document",
  name: "Upload New Document",
  description: "Uploads a document to DocumentPro's parser. [See the documentation](https://docs.documentpro.ai/docs/using-api/manage-documents/import-files)",
  version: "1.0.0",
  type: "action",
  props: {
    documentpro,
    parserId: {
      propDefinition: [
        documentpro,
        "parserId",
      ],
    },
    document: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.pdf`)",
    },
  },
  async run({ $ }) {
    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(this.document);

    const formData = new FormData();
    formData.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.documentpro.uploadDocument({
      parserId: this.parserId,
      data: formData,
      headers: formData.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded document with Id: ${response.request_id}`);
    return response;
  },
};
