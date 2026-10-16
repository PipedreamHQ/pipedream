import beliq from "../../beliq.app.mjs";
import {
  resolveDocument, writeDocument,
} from "../../common/io.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "beliq-convert-invoice",
  name: "Convert Invoice",
  description: "Convert an e-invoice from one format to another, e.g. a Factur-X PDF to UBL or a CII XRechnung to Peppol BIS, and write the result to `/tmp`. Use it when a recipient or network needs a different format than the one you have. Returns the file's `path` plus `lostElements`, the fields the target format could not carry. Check the result with **Validate Invoice**. A conversion that would silently drop a French CTC code fails unless Drop France CTC Overlay is on. Uses one document of quota. [See the documentation](https://docs.beliq.eu/api-reference/convert/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    sourceFormat: {
      propDefinition: [
        beliq,
        "sourceFormat",
      ],
    },
    targetFormat: {
      propDefinition: [
        beliq,
        "targetFormat",
      ],
    },
    targetProfile: {
      propDefinition: [
        beliq,
        "targetProfile",
      ],
    },
    dropFranceCtcOverlay: {
      propDefinition: [
        beliq,
        "dropFranceCtcOverlay",
      ],
    },
    filename: {
      propDefinition: [
        beliq,
        "filename",
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
      accessMode: "read-write",
      sync: true,
    },
  },
  async run({ $ }) {
    const {
      bytes, contentType,
    } = await resolveDocument(this);
    const result = await this.beliq.convertInvoice({
      document: bytes,
      targetFormat: this.targetFormat,
      sourceFormat: this.sourceFormat,
      // The SDK sends a target profile only to the Factur-X / ZUGFeRD family.
      targetProfile: this.targetProfile,
      dropFranceCtcOverlay: this.dropFranceCtcOverlay === true,
      contentType,
      advanced: parseObject(this.advanced, "Advanced (JSON)"),
    });
    const out = await writeDocument(result, "converted", this.filename);
    $.export("$summary", `Converted to ${out.filename} (${out.sizeBytes} bytes)`);
    return out;
  },
};
