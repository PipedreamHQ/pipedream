import beliq from "../../beliq.app.mjs";
import { writeDocument } from "../../common/io.mjs";
import {
  parseObject, resolveGenerateTarget, usableFacturxProfile,
} from "../../common/utils.mjs";

export default {
  key: "beliq-generate-invoice",
  name: "Generate Invoice",
  description: "Create a standard-compliant e-invoice from a JSON invoice object and write it to `/tmp`: XML (XRechnung, ZUGFeRD, Factur-X, Peppol BIS) or a PDF (a hybrid PDF/A-3 on Factur-X and ZUGFeRD). Use it when you have invoice data, e.g. from a CRM, shop or spreadsheet row, and need a file to send or archive. Returns the file's `path`, and with XML output the `xml` text too; pass the `path` to **Validate Invoice** or **Convert Invoice**. With Validate Result on (the default), an invoice that breaks a rule fails with the rule IDs instead of returning a non-compliant document. Uses one document of quota. [See the documentation](https://docs.beliq.eu/api-reference/generate/)",
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
      // XRechnung and Peppol BIS have no hybrid PDF, and the API refuses PDF for
      // them unless the request names a visual to render. Factur-X and ZUGFeRD
      // render theirs either way, so this is inert for them.
      input.template = "standard";
    }

    const result = await this.beliq.generateInvoice(input);
    const out = await writeDocument(result, "invoice", this.filename);
    if (result.xml) {
      out.xml = result.xml;
    }
    $.export("$summary", `Generated ${out.filename} (${out.sizeBytes} bytes)`);
    return out;
  },
};
