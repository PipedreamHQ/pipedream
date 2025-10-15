import airparser from "../../airparser.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import FormData from "form-data";

export default {
  key: "airparser-upload-document-parse",
  name: "Upload Document and Parse",
  description: "Uploads a document into the inbox for data extraction. [See the documentation](https://help.airparser.com/public-api/public-api)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    airparser,
    inboxId: {
      propDefinition: [
        airparser,
        "inboxId",
      ],
    },
    filePath: {
      type: "string",
      label: "File Path or URL",
      description: "The file to upload. Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/myFile.txt`)",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "The user-defined extraction schema for data extraction",
      optional: true,
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
      stream, metadata,
    } = await getFileStreamAndMetadata(this.filePath);
    const data = new FormData();
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    if (this.metadata) {
      data.append("meta", JSON.stringify(this.metadata));
    }

    const response = await this.airparser.uploadDocument({
      $,
      inboxId: this.inboxId,
      data,
    });
    $.export("$summary", `Successfully uploaded document with ID ${response}`);
    return response;
  },
};
