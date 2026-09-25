import beliq from "../../beliq.app.mjs";
import { resolveDocument } from "../../common/io.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "beliq-validate-invoice",
  name: "Validate Invoice",
  description: "Check an XML or PDF e-invoice against the rules of its standard (EN 16931 plus the national rules, e.g. XRechnung or Peppol BIS) and return a verdict: `valid`, and the failing rules with their IDs and messages. Use it before sending an invoice, or to check one you received. Takes pasted XML or a file, e.g. the `path` that **Generate Invoice** or **Convert Invoice** returns. An invalid document is a normal result, not an error. Uses one document of quota; **Check Account** shows how many are left. [See the documentation](https://docs.beliq.eu/api-reference/validate/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    beliq,
    inputSource: {
      propDefinition: [
        beliq,
        "inputSource",
      ],
    },
    documentText: {
      propDefinition: [
        beliq,
        "documentText",
      ],
    },
    filePath: {
      propDefinition: [
        beliq,
        "filePath",
      ],
    },
    contentType: {
      propDefinition: [
        beliq,
        "contentType",
      ],
    },
    format: {
      propDefinition: [
        beliq,
        "validateFormat",
      ],
    },
    franceCtc: {
      propDefinition: [
        beliq,
        "franceCtc",
      ],
    },
    advanced: {
      propDefinition: [
        beliq,
        "advanced",
      ],
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      bytes, contentType,
    } = await resolveDocument(this);
    const result = await this.beliq.validateInvoice({
      document: bytes,
      format: this.format,
      franceCtc: this.franceCtc === true,
      contentType,
      advanced: parseObject(this.advanced, "Advanced (JSON)"),
    });
    const errorCount = Array.isArray(result.errors)
      ? result.errors.length
      : 0;
    $.export("$summary", result.valid
      ? "Document is valid"
      : `Document is invalid (${errorCount} ${errorCount === 1
        ? "error"
        : "errors"})`);
    return result;
  },
};
