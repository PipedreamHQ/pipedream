import beliq from "../../beliq.app.mjs";
import { resolveDocument } from "../../common/io.mjs";
import {
  parseObject, verdictSummary,
} from "../../common/utils.mjs";

export default {
  key: "beliq-validate-invoice",
  name: "Validate Invoice",
  description: "Check an XML or PDF e-invoice against the rule packs and schemas beliq lists for its format, and return the API's verdict: `valid`, `verificationBadgeLabel` (the check depth the API states; a result without it states none), and the failing rules with their IDs and messages. `valid` means the document passed those rule packs and schemas in the stated versions, not that every recipient or tax authority accepts it. A France CTC block (`franceCtcBlockingRuleIds`) ends a transmission even where `valid` is true, so the step summary names it first and counts the document as failed. Use it before sending an invoice, or to check one you received. Takes pasted XML or a file, e.g. the `path` that **Generate Invoice** or **Convert Invoice** returns. An invalid document is a normal result, not an error. Uses one document of quota; **Check Account** shows how many are left. [See the documentation](https://docs.beliq.eu/api-reference/validate/)",
  version: "0.1.0",
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
    $.export("$summary", verdictSummary(result, "Verdict"));
    return result;
  },
};
