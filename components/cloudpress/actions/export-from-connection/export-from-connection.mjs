import cloudpress from "../../cloudpress.app.mjs";

export default {
  key: "cloudpress-export-from-connection",
  name: "Export From Connection",
  description: "Exports content from a connection in Cloudpress. [See the documentation](https://docs.usecloudpress.com/api-reference/endpoint/export/from-connection)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cloudpress,
    destinationConnectionId: {
      propDefinition: [
        cloudpress,
        "connectionIds",
      ],
      type: "integer",
      label: "Destination Connection ID",
      description: "Identifier of the destination connection",
    },
    sourceConnectionId: {
      propDefinition: [
        cloudpress,
        "connectionIds",
        () => ({
          kind: "source",
        }),
      ],
      type: "integer",
      label: "Source Connection ID",
      description: "Identifier of the source connection",
    },
    documentReference: {
      propDefinition: [
        cloudpress,
        "documentReference",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.cloudpress.exportFromConnection({
      $,
      data: {
        destinationConnection: this.destinationConnectionId,
        sourceConnection: this.sourceConnectionId,
        sourceDocumentReference: this.documentReference,
      },
    });
    $.export("$summary", `Successfully exported from connection with ID ${this.connection}'`);
    return response;
  },
};
