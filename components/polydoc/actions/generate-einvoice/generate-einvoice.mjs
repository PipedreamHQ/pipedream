import polydoc from "../../polydoc.app.mjs";
import { buildRequestBody } from "../../common/build-request-body.mjs";
import {
  extractApiErrorMessage, handleResponse,
} from "../../common/output.mjs";
import {
  commonParams, validateParams,
} from "../../common/params.mjs";

export default {
  key: "polydoc-generate-einvoice",
  name: "Generate E-Invoice",
  description: "Generate a ZUGFeRD or Factur-X hybrid PDF/A-3 e-invoice (EN 16931). [See the documentation](https://docs.polydoc.tech).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    polydoc,
    sourceType: {
      propDefinition: [
        polydoc,
        "sourceType",
      ],
    },
    url: {
      propDefinition: [
        polydoc,
        "url",
      ],
    },
    html: {
      propDefinition: [
        polydoc,
        "html",
      ],
    },
    templateId: {
      propDefinition: [
        polydoc,
        "templateId",
      ],
    },
    templateData: {
      propDefinition: [
        polydoc,
        "templateData",
      ],
    },
    eInvoiceStandard: {
      propDefinition: [
        polydoc,
        "eInvoiceStandard",
      ],
    },
    eInvoiceProfile: {
      propDefinition: [
        polydoc,
        "eInvoiceProfile",
      ],
    },
    invoice: {
      propDefinition: [
        polydoc,
        "invoice",
      ],
    },
    eInvoiceVerify: {
      propDefinition: [
        polydoc,
        "eInvoiceVerify",
      ],
    },
    filename: {
      propDefinition: [
        polydoc,
        "filename",
      ],
    },
    tag: {
      propDefinition: [
        polydoc,
        "tag",
      ],
    },
    timeout: {
      propDefinition: [
        polydoc,
        "timeout",
      ],
    },
    deliveryMode: {
      propDefinition: [
        polydoc,
        "deliveryMode",
      ],
    },
    presignedUrl: {
      propDefinition: [
        polydoc,
        "presignedUrl",
      ],
    },
    webhookUrl: {
      propDefinition: [
        polydoc,
        "webhookUrl",
      ],
    },
    webhookOptions: {
      propDefinition: [
        polydoc,
        "webhookOptions",
      ],
    },
    advanced: {
      propDefinition: [
        polydoc,
        "advanced",
      ],
    },
  },
  async run({ $ }) {
    validateParams(this);

    const params = {
      ...commonParams(this),
      operation: "einvoice",
      eInvoiceStandard: this.eInvoiceStandard,
      eInvoiceProfile: this.eInvoiceProfile,
      eInvoiceVerify: this.eInvoiceVerify,
      invoice: this.invoice,
    };

    const {
      endpoint, body, isBinary,
    } = buildRequestBody(params);

    let response;
    try {
      response = await this.polydoc._request({
        $,
        endpoint,
        body,
        isBinary,
      });
    } catch (error) {
      const message = extractApiErrorMessage(error);
      throw new Error(message
        ? `PolyDoc API error: ${message}`
        : error.message);
    }

    const result = await handleResponse({
      response,
      isBinary,
      operation: "einvoice",
      filename: this.filename,
    });

    $.export("$summary", result.path
      ? `Created e-invoice ${result.filename} (${result.sizeBytes} bytes)`
      : "E-invoice delivered");

    return result;
  },
};
