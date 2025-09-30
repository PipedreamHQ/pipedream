import FormData from "form-data";
import { getFileStreamAndMetadata } from "@pipedream/platform";
import ragie from "../../ragie.app.mjs";

export default {
  key: "ragie-create-document",
  name: "Create Document",
  description: "Creates a new document in Ragie. [See the documentation](https://docs.ragie.ai/reference/createdocument)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ragie,
    file: {
      propDefinition: [
        ragie,
        "documentFile",
      ],
    },
    mode: {
      propDefinition: [
        ragie,
        "documentMode",
      ],
      optional: true,
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Metadata for the document. Keys must be strings. Values may be strings, numbers, booleans, or lists of strings.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description: "An optional identifier for the document. A common value might be an ID in an external system or the URL where the source file may be found.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "An optional name for the document. If set, the document will have this name. Otherwise, it will default to the file's name.",
      optional: true,
    },
    partition: {
      propDefinition: [
        ragie,
        "partition",
      ],
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
    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.file);
    data.append("file", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });
    if (this.mode) data.append("mode", this.mode);
    if (this.metadata) data.append("metadata", JSON.stringify(this.metadata));
    if (this.externalId) data.append("external_id", this.externalId);
    if (this.name) data.append("name", this.name);
    if (this.partition) data.append("partition", this.partition);

    const response = await this.ragie.createDocument({
      $,
      data,
      headers: data.getHeaders(),
    });

    $.export("$summary", `Created document: ${response.name} (ID: ${response.id})`);
    return response;
  },
};
