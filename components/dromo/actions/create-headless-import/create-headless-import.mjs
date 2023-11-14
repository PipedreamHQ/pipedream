import dromo from "../../dromo.app.mjs";

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
      propDefinition: [
        dromo,
        "originalFilename",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dromo.createHeadlessImport({
      data: {
        schema_id: this.schemaId,
        original_filename: this.originalFilename,
      },
    });
    $.export("$summary", `Successfully created headless import with ID: ${response.id}`);
    return response;
  },
};
