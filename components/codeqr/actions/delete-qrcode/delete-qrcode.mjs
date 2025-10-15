import { ConfigurationError } from "@pipedream/platform";
import codeqr from "../../codeqr.app.mjs";

export default {
  key: "codeqr-delete-qrcode",
  name: "Delete a QR Code",
  description:
    "Deletes a QR Code in CodeQR by qrcodeId or externalId. [See the documentation](https://codeqr.mintlify.app/api-reference/endpoint/delete-a-qrcode)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    codeqr,
    qrcodeId: {
      propDefinition: [
        codeqr,
        "qrcodeId",
      ],
      description: "The unique ID of the QR Code to delete.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description:
        "ID of the QR Code in your database. Must be prefixed with ext_.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      qrcodeId, externalId,
    } = this;
    if (!qrcodeId && !externalId) {
      throw new ConfigurationError(
        "Please provide either qrcodeId or externalId to delete the QR Code.",
      );
    }
    const identifier = qrcodeId || externalId;
    await this.codeqr.deleteQrcode({
      $,
      identifier,
    });
    $.export("$summary", `QR Code deleted successfully (${identifier}).`);
    return {
      success: true,
    };
  },
};
