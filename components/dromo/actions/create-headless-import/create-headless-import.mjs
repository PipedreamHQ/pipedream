import dromo from "../../dromo.app.mjs";

export default {
  key: "dromo-create-headless-import",
  name: "Create Headless Import",
  description: "Creates a new headless import. [See the documentation]()",
  version: "0.0.{{ts}}",
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
    importMetadata: {
      propDefinition: [
        dromo,
        "importMetadata",
      ],
    },
    sourceUrl: {
      propDefinition: [
        dromo,
        "sourceUrl",
      ],
    },
    destinationFolderId: {
      propDefinition: [
        dromo,
        "destinationFolderId",
      ],
    },
    notificationPreferences: {
      propDefinition: [
        dromo,
        "notificationPreferences",
      ],
    },
    excludeFormats: {
      propDefinition: [
        dromo,
        "excludeFormats",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dromo.createHeadlessImport({
      data: {
        schema_id: this.schemaId,
        original_filename: this.originalFilename,
        import_metadata: this.importMetadata,
        source_url: this.sourceUrl,
        destination_folder_id: this.destinationFolderId,
        notification_preferences: this.notificationPreferences,
        exclude_formats: this.excludeFormats,
      },
    });
    $.export("$summary", `Successfully created headless import with ID: ${response.id}`);
    return response;
  },
};
