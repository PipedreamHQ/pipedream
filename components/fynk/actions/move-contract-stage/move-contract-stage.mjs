import fynk from "../../fynk.app.mjs";

export default {
  key: "fynk-move-contract-stage",
  name: "Move Contract Stage",
  description: "Move a contract forward in Fynk's lifecycle. See documentation pages [move document to review stage](https://app.fynk.com/v1/docs#/operations/v1.documents.stage-transitions.review) and [move document to signing stage](https://app.fynk.com/v1/docs#/operations/v1.documents.stage-transitions.signing).",
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
    targetStage: {
      propDefinition: [
        fynk,
        "targetStage",
      ],
    },
    signatureType: {
      type: "string",
      label: "Signature Type",
      description: "The signature type to use when moving to signing stage. Only used when target_stage is 'signing'",
      optional: true,
      options: [
        {
          label: "Simple Electronic Signature (SES)",
          value: "ses",
        },
        {
          label: "Advanced Electronic Signature (AES)",
          value: "aes",
        },
        {
          label: "Qualified Electronic Signature (QES)",
          value: "qes",
        },
      ],
    },
    sequentialSigning: {
      type: "boolean",
      label: "Sequential Signing",
      description: "If true, signatures will be requested in the order defined by the signatories' signing_order. Only used when target_stage is 'signing'",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "Message to include in the email sent to the document's signatories. This is included in addition to the default email text provided by fynk. Only used when target_stage is 'signing'",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      documentUuid,
      targetStage,
      signatureType,
      sequentialSigning,
      message,
    } = this;

    let response;
    if (targetStage === "review") {
      response = await this.fynk.moveDocumentToReview({
        $,
        documentUuid,
      });
    } else if (targetStage === "signing") {
      const data = {};
      if (signatureType !== undefined) data.signature_type = signatureType;
      if (sequentialSigning !== undefined) data.sequential_signing = sequentialSigning;
      if (message !== undefined) data.message = message;

      response = await this.fynk.moveDocumentToSigning({
        $,
        documentUuid,
        data: Object.keys(data).length > 0
          ? data
          : undefined,
      });
    } else {
      throw new Error(`Invalid target stage: ${targetStage}`);
    }

    $.export("$summary", `Successfully moved contract ${documentUuid} to ${targetStage} stage`);
    return response;
  },
};

