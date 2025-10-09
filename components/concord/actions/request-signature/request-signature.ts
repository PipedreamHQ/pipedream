import { defineAction } from "@pipedream/types";
import app from "../../app/concord.app";
import { RequestSignatureParams } from "../../common/types/requestParams";

export default defineAction({
  name: "Request Signature",
  description:
    "Request signers to sign an agreement [See the documentation](https://api.doc.concordnow.com/#tag/Signature/operation/RequestSignature)",
  key: "concord-request-signature",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    agreementUid: {
      propDefinition: [
        app,
        "agreementUid",
        ({ organizationId }: { organizationId: number; }) => ({
          organizationId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      organizationId,
      agreementUid,
    } = this;

    const params: RequestSignatureParams = {
      $,
      organizationId,
      agreementUid,
    };

    const response = await this.app.requestSignature(params);
    $.export("$summary", "Successfully requested signature");
    return response;
  },
});
