import polydoc from "../../polydoc.app.mjs";
import { buildRequestBody } from "../../common/build-request-body.mjs";
import {
  extractApiErrorMessage, handleResponse,
} from "../../common/output.mjs";
import {
  commonParams, validateParams,
} from "../../common/params.mjs";

export default {
  key: "polydoc-convert-screenshot",
  name: "Capture Screenshot",
  description: "Capture a screenshot of a URL, inline HTML, or a saved template. [See the documentation](https://docs.polydoc.tech).",
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
    imageType: {
      propDefinition: [
        polydoc,
        "imageType",
      ],
    },
    fullPage: {
      propDefinition: [
        polydoc,
        "fullPage",
      ],
    },
    quality: {
      propDefinition: [
        polydoc,
        "quality",
      ],
    },
    viewportWidth: {
      propDefinition: [
        polydoc,
        "viewportWidth",
      ],
    },
    viewportHeight: {
      propDefinition: [
        polydoc,
        "viewportHeight",
      ],
    },
    devicePixelRatio: {
      propDefinition: [
        polydoc,
        "devicePixelRatio",
      ],
    },
    outputEncoding: {
      propDefinition: [
        polydoc,
        "outputEncoding",
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

    const wantBase64 = this.outputEncoding === "base64";

    const params = {
      ...commonParams(this),
      operation: "screenshot",
      screenshotOptions: {
        imageType: this.imageType,
        fullPage: this.fullPage,
        quality: this.quality,
        viewportWidth: this.viewportWidth,
        viewportHeight: this.viewportHeight,
        devicePixelRatio: this.devicePixelRatio,
        encoding: wantBase64 ? "base64" : undefined,
      },
    };

    const {
      endpoint, body, isBinary,
    } = buildRequestBody(params);

    // base64 returns JSON, not bytes, so it is not handled as a binary download.
    const effectiveBinary = isBinary && !wantBase64;

    let response;
    try {
      response = await this.polydoc._request({
        $,
        endpoint,
        body,
        isBinary: effectiveBinary,
      });
    } catch (error) {
      const message = extractApiErrorMessage(error);
      throw new Error(message
        ? `PolyDoc API error: ${message}`
        : error.message);
    }

    const result = await handleResponse({
      response,
      isBinary: effectiveBinary,
      operation: "screenshot",
      imageType: this.imageType,
      filename: this.filename,
    });

    $.export("$summary", result.path
      ? `Captured screenshot ${result.filename} (${result.sizeBytes} bytes)`
      : "Screenshot delivered");

    return result;
  },
};
