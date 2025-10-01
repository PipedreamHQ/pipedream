import dromo from "../../dromo.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "dromo-create-headless-import",
  name: "Create Headless Import",
  description: "Creates a new headless import. [See the documentation](https://developer.dromo.io/api/#tag/headless/operation/createHeadlessImport)",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dromo,
    schemaId: {
      propDefinition: [
        dromo,
        "schemaId",
      ],
    },
    originalFilename: {
      type: "string",
      label: "Original Filename",
      description: "The original filename of the imported file. If not provided, the name of the uploaded file will be used.",
      optional: true,
    },
    file: {
      type: "string",
      label: "File Path Or Url",
      description: "Provide either a file URL or a path to a file in the `/tmp` directory (for example, `/tmp/example.csv`)",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  methods: {
    uploadFile(url, data) {
      return this.dromo._makeRequest({
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        url,
        data,
      });
    },
  },
  async run({ $ }) {
    const {
      dromo,
      schemaId,
      originalFilename,
      file,
      uploadFile,
    } = this;

    const {
      stream,
      metadata,
    } = await getFileStreamAndMetadata(file);

    const response = await dromo.createHeadlessImport({
      data: {
        schema_id: schemaId,
        original_filename: originalFilename || metadata.name,
      },
      $,
    });

    const uploadUrl = response.upload;
    await uploadFile(uploadUrl, stream);

    let importItem;
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    do {
      importItem = await dromo.getHeadlessImport({
        importId: response.id,
        $,
      });
      if (importItem?.status !== "AWAITING_UPLOAD") {
        break;
      }
      await timer(5000);
    } while (true);

    $.export("$summary", `Successfully created headless import with ID: ${response.id}`);
    return importItem;
  },
};
