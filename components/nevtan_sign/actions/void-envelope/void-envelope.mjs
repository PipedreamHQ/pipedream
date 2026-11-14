import nevtanSign from "../../nevtan_sign.app.mjs";

export default {
  key: "nevtan_sign-void-envelope",
  name: "Void Envelope",
  description: "Void an envelope that has been sent or is in progress, so recipients can no longer sign it. Only the envelope's creator can void it; drafts, completed envelopes and already-voided envelopes cannot be voided.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    nevtanSign,
    workspaceId: {
      propDefinition: [
        nevtanSign,
        "workspaceId",
      ],
    },
    envelopeId: {
      propDefinition: [
        nevtanSign,
        "envelopeId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.nevtanSign.voidEnvelope({
      $,
      workspaceId: this.workspaceId,
      envelopeId: this.envelopeId,
    });

    $.export("$summary", `Successfully voided envelope ${this.envelopeId}`);
    return response.data;
  },
};
