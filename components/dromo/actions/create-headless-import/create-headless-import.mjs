import dromo from "../../dromo.app.mjs";
import fs from "fs";

export default {
  key: "dromo-create-headless-import",
  name: "Create Headless Import",
  description: "Creates a new headless import. [See the documentation](https://developer.dromo.io/api/#tag/headless/operation/createHeadlessImport)",
  version: "0.0.1",
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
      description: "The original filename of the imported file",
    },
    filePath: {
      type: "string",
      label: "File Path",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.csv`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
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
    const response = await this.dromo.createHeadlessImport({
      data: {
        schema_id: this.schemaId,
        original_filename: this.originalFilename,
      },
      $,
    });

    const uploadUrl = response.upload;
    const fileBuffer = fs.readFileSync(this.filePath);
    await this.uploadFile(uploadUrl, fileBuffer);

    let importItem;
    const timer = (ms) => new Promise((res) => setTimeout(res, ms));
    do {
      importItem = await this.dromo.getHeadlessImport({
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
