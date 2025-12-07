import fynk from "../../fynk.app.mjs";

export default {
  key: "fynk-update-contract-metadata",
  name: "Update Contract Metadata",
  description: "Update metadata values or dynamic fields associated with a contract in Fynk. See [documentation](https://app.fynk.com/v1/docs#/operations/v1.documents.metadata-values.update).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    fynk,
    documentUuid: {
      propDefinition: [
        fynk,
        "documentUuid",
      ],
    },
    metadataValueUuid: {
      propDefinition: [
        fynk,
        "metadataValueUuid",
      ],
    },
    value: {
      type: "string",
      label: "Value",
      description: "The new value for the metadata field. The format depends on the metadata's value_type. See the API documentation for format details.",
    },
  },
  async run({ $ }) {
    const {
      documentUuid,
      metadataValueUuid,
      value,
    } = this;

    const response = await this.fynk.updateDocumentMetadataValue({
      $,
      documentUuid,
      metadataValueUuid,
      data: {
        value,
      },
    });

    $.export("$summary", `Successfully updated metadata value for contract ${documentUuid}`);
    return response;
  },
};

