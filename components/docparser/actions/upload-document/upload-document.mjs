import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import docparser from "../../docparser.app.mjs";

export default {
  key: "docparser-upload-document",
  name: "Upload Document",
  description: "Uploads a document to docparser that initiates parsing immediately after reception. [See the documentation](https://docparser.com/api/#import-documents)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    docparser,
    parserId: {
      propDefinition: [
        docparser,
        "parserId",
      ],
    },
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.pdf`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(this.file);

    const data = new FormData();
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.docparser.uploadDocument({
      $,
      parserId: this.parserId,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Successfully uploaded document. Document ID: ${response.id}`);
    return response;
  },
};
