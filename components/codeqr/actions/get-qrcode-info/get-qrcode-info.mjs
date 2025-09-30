import { ConfigurationError } from "@pipedream/platform";
import codeqr from "../../codeqr.app.mjs";

export default {
  key: "codeqr-get-qrcode-info",
  name: "Get QR Code Info",
  description:
    "Retrieves QR Code info by qrcodeId, externalId, domain, or key via query string. [See the documentation](https://codeqr.mintlify.app/api-reference/endpoint/retrieve-a-qrcode)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    codeqr,
    qrcodeId: {
      propDefinition: [
        codeqr,
        "qrcodeId",
      ],
      description: "The unique ID of the QR Code.",
      optional: true,
    },
    externalId: {
      type: "string",
      label: "External ID",
      description:
        "ID of the QR Code in your database. Must be prefixed with ext_.",
      optional: true,
    },
    domain: {
      type: "string",
      label: "Domain",
      description: "The domain of the QR Code to retrieve.",
      optional: true,
    },
    key: {
      type: "string",
      label: "Key",
      description: "The key of the QR Code to retrieve.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      qrcodeId, externalId, domain, key,
    } = this;
    if (!qrcodeId && !externalId && !(domain && key)) {
      throw new ConfigurationError(
        "Please provide qrcodeId, externalId, or both domain and key.",
      );
    }
    const params = {};
    qrcodeId && (params.qrcodeId = qrcodeId);
    externalId && (params.externalId = externalId);
    domain && (params.domain = domain);
    key && (params.key = key);
    const response = await this.codeqr.getQrcodeInfo({
      $,
      params,
    });
    $.export(
      "$summary",
      `QR Code info retrieved successfully${
        qrcodeId
          ? ` (ID: ${qrcodeId})`
          : externalId
            ? ` (external ID: ${externalId})`
            : ` (${domain}/${key})`
      }.`,
    );
    return response;
  },
};
