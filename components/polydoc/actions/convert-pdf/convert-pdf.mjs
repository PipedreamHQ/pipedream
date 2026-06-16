import polydoc from "../../polydoc.app.mjs";
import { buildRequestBody } from "../../common/build-request-body.mjs";
import {
  extractApiErrorMessage, handleResponse,
} from "../../common/output.mjs";
import {
  commonParams, validateParams,
} from "../../common/params.mjs";

export default {
  key: "polydoc-convert-pdf",
  name: "Convert to PDF",
  description: "Convert a URL, inline HTML, or a saved template to a PDF. [See the documentation](https://docs.polydoc.tech).",
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
    format: {
      propDefinition: [
        polydoc,
        "format",
      ],
    },
    landscape: {
      propDefinition: [
        polydoc,
        "landscape",
      ],
    },
    printBackground: {
      propDefinition: [
        polydoc,
        "printBackground",
      ],
    },
    pageRanges: {
      propDefinition: [
        polydoc,
        "pageRanges",
      ],
    },
    outline: {
      propDefinition: [
        polydoc,
        "outline",
      ],
    },
    tagged: {
      propDefinition: [
        polydoc,
        "tagged",
      ],
    },
    scale: {
      propDefinition: [
        polydoc,
        "scale",
      ],
    },
    marginTop: {
      propDefinition: [
        polydoc,
        "marginTop",
      ],
    },
    marginRight: {
      propDefinition: [
        polydoc,
        "marginRight",
      ],
    },
    marginBottom: {
      propDefinition: [
        polydoc,
        "marginBottom",
      ],
    },
    marginLeft: {
      propDefinition: [
        polydoc,
        "marginLeft",
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
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    validateParams(this);

    const scaleNum = this.scale !== undefined && this.scale !== ""
      ? Number(this.scale)
      : undefined;

    const params = {
      ...commonParams(this),
      operation: "pdf",
      pdfOptions: {
        format: this.format,
        landscape: this.landscape,
        printBackground: this.printBackground,
        pageRanges: this.pageRanges,
        outline: this.outline,
        tagged: this.tagged,
        scale: Number.isFinite(scaleNum) ? scaleNum : undefined,
        marginTop: this.marginTop,
        marginRight: this.marginRight,
        marginBottom: this.marginBottom,
        marginLeft: this.marginLeft,
      },
    };

    const {
      endpoint, body, isBinary,
    } = buildRequestBody(params);

    let response;
    // Binary error bodies arrive as raw bytes; decode them to surface PolyDoc's message.
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
      operation: "pdf",
      filename: this.filename,
    });

    $.export("$summary", result.path
      ? `Created PDF ${result.filename} (${result.sizeBytes} bytes)`
      : "PDF delivered");

    return result;
  },
};
