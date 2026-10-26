import beliq from "../../beliq.app.mjs";
import { writeDocument } from "../../common/io.mjs";
import {
  parseObject, resolveGenerateTarget, usableFacturxProfile, verdictSummary,
} from "../../common/utils.mjs";

export default {
  key: "beliq-generate-invoice",
  name: "Generate Invoice",
  description: "Create an e-invoice from a JSON invoice object and write it to `/tmp`: XML (XRechnung, ZUGFeRD, Factur-X, Peppol BIS, FatturaPA, Facturae, e-SLOG and KSeF FA(3)) or a PDF (a hybrid PDF/A-3 on Factur-X and ZUGFeRD, a visualization on the others). Use it when you have invoice data, e.g. from a CRM, shop or spreadsheet row, and need a file to send or archive. Returns the file's `path`, with XML output the `xml` text too, and the API's verdict on the invoice XML in `validationResult`, whose `verificationBadgeLabel` is the check depth the API states (a verdict without it states none). Pass the `path` to **Validate Invoice**, or for XRechnung, ZUGFeRD, Factur-X and Peppol BIS to **Convert Invoice**, which takes no national format. With Validate Result on (the default), an invoice that breaks a rule fails with the rule IDs instead of returning the document. With it off nothing is checked: `validationResult.verified` is `false`, and `valid` is then `false` because nothing looked, not because the document failed. Uses one document of quota. [See the documentation](https://docs.beliq.eu/api-reference/generate/)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    beliq,
    standard: {
      propDefinition: [
        beliq,
        "standard",
      ],
    },
    output: {
      propDefinition: [
        beliq,
        "output",
      ],
    },
    facturxProfile: {
      propDefinition: [
        beliq,
        "facturxProfile",
      ],
    },
    invoice: {
      propDefinition: [
        beliq,
        "invoice",
      ],
    },
    verify: {
      propDefinition: [
        beliq,
        "verify",
      ],
    },
    pdfTemplateId: {
      propDefinition: [
        beliq,
        "pdfTemplateId",
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
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const target = resolveGenerateTarget(this.standard);
    const input = {
      standard: target.standard,
      invoice: parseObject(this.invoice, "Invoice") ?? {},
      output: target.output ?? this.output ?? "xml",
      // The API validates before returning unless told not to. An absent prop is
      // the default, not an opt-out, so only an explicit false turns it off.
      verify: this.verify !== false,
      // Always the JSON envelope: it is the only response that carries the
      // verdict and its check depth, and the API does the same work for either
      // shape. The document bytes still come back decoded.
      seal: true,
      advanced: parseObject(this.advanced, "Advanced (JSON)"),
    };
    if (target.profile) {
      input.profile = target.profile;
    } else if (usableFacturxProfile(target.standard, this.facturxProfile)) {
      input.facturxProfile = this.facturxProfile;
    }
    const pdfTemplateId = (this.pdfTemplateId ?? "").trim();
    if (pdfTemplateId) {
      input.pdfTemplateId = pdfTemplateId;
    } else if (input.output === "pdf") {
      // Only Factur-X and ZUGFeRD have a hybrid PDF. The API refuses PDF for
      // every other standard unless the request names a visual to render.
      // Factur-X and ZUGFeRD render theirs either way, so this is inert for them.
      input.template = "standard";
    }

    const result = await this.beliq.generateInvoice(input);
    const out = await writeDocument(result, "invoice", this.filename);
    if (result.xml) {
      out.xml = result.xml;
    }
    out.sha256 = result.sha256;
    out.validationResult = result.validationResult;
    // The verdict is about the invoice XML, also when the file is a PDF.
    const subject = out.contentType.includes("pdf")
      ? "verdict on the invoice XML"
      : "verdict";
    $.export("$summary", verdictSummary(result.validationResult, `Generated ${out.filename} (${out.sizeBytes} bytes), ${subject}`));
    return out;
  },
};
