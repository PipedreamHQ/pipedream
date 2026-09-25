import { Beliq } from "@beliq/sdk";
import { mapError } from "./common/errors.mjs";
import {
  CONTENT_TYPE_OPTIONS,
  CONVERT_SOURCE_OPTIONS,
  CONVERT_TARGET_OPTIONS,
  INPUT_SOURCE_OPTIONS,
  OUTPUT_OPTIONS,
  PARSE_FORMAT_OPTIONS,
  PROFILE_OPTIONS,
  SAMPLE_INVOICE,
  STANDARD_OPTIONS,
  VALIDATE_FORMAT_OPTIONS,
} from "./common/constants.mjs";

export default {
  type: "app",
  app: "beliq",
  propDefinitions: {
    standard: {
      type: "string",
      label: "Standard",
      description: "The e-invoice standard to produce, e.g. `xrechnung` for a German public-sector buyer or `facturx` for a French or German hybrid PDF. The NLCIUS option is Peppol BIS with the Dutch `netherlands-nlcius` profile.",
      options: STANDARD_OPTIONS,
      default: "xrechnung",
    },
    output: {
      type: "string",
      label: "Output",
      description: "The document kind to return, e.g. `xml`. `xml` is a pure e-invoice. `pdf` gives a hybrid PDF/A-3 with the XML embedded on Factur-X and ZUGFeRD; XRechnung and Peppol BIS have no hybrid form, so they return a visualization with no XML inside it and their legal document stays the XML.",
      options: OUTPUT_OPTIONS,
      default: "xml",
    },
    facturxProfile: {
      type: "string",
      label: "Factur-X / ZUGFeRD Profile",
      description: "The Factur-X or ZUGFeRD profile, e.g. `en16931`. Applied only when Standard (or Target Format) is Factur-X or ZUGFeRD. `extended-ctc-fr` is a Factur-X profile; ZUGFeRD ignores it.",
      options: PROFILE_OPTIONS,
      optional: true,
      default: "en16931",
    },
    invoice: {
      type: "object",
      label: "Invoice",
      description: `The invoice as an EN 16931 JSON object. Required: \`number\`, \`issueDate\` (\`YYYY-MM-DD\`), \`currencyCode\`, \`seller\`, \`buyer\`, \`lines\` (at least one), \`totalNetAmount\`, \`totalTaxAmount\`, \`totalGrossAmount\`, and in practice \`taxSummary\` (one entry per VAT category and rate used on the lines). \`seller\` and \`buyer\` each need \`name\` and \`address\` (\`city\`, \`postalCode\`, two-letter \`countryCode\`; \`street\` optional); give \`vatId\` when the party has one. Each line needs \`description\`, \`quantity\`, \`unitCode\` (e.g. \`HUR\`), \`unitPrice\`, \`lineTotal\`, \`vatRate\` and \`vatCategoryCode\` (e.g. \`S\`); each \`taxSummary\` entry needs \`vatCategoryCode\`, \`vatRate\`, \`taxableAmount\` and \`taxAmount\`. XRechnung also needs \`buyerReference\`, a seller contact (\`contactName\`, \`email\`, \`phone\`) and an electronic address on both parties. Each party can supply it in any of three ways, tried in this order: \`peppol\` with \`schemeId\` and \`id\` (e.g. \`{ "schemeId": "0088", "id": "4030000000003" }\`), an \`email\`, or a \`vatId\` plus an \`address.countryCode\` beliq supports. Take a Peppol ID from the party itself or from its entry in the [Peppol Directory](https://directory.peppol.eu/public); if you cannot confirm one, leave \`peppol\` out and rely on \`email\` or \`vatId\` plus country instead of making one up. A cross-border B2B sale within the EU is usually reverse charge: \`vatCategoryCode\` \`AE\` at \`vatRate\` 0, with an \`exemptionReasonText\` such as \`Reverse charge\` on the \`taxSummary\` entry. Every field: [Invoice object](https://docs.beliq.eu/api-reference/generate/#invoice-object).

Example, a valid XRechnung between two German companies, one line at 19% standard-rate VAT:

\`\`\`json
${JSON.stringify(SAMPLE_INVOICE, null, 2)}
\`\`\``,
    },
    verify: {
      type: "boolean",
      label: "Validate Result",
      description: "Validate the generated document before returning it, e.g. `true` (the default). When on, an invoice that breaks a rule of the standard fails with the rule IDs instead of returning a non-compliant document.",
      optional: true,
      default: true,
    },
    pdfTemplateId: {
      type: "string",
      label: "PDF Template ID",
      description: "The ref of a PDF template saved in the beliq dashboard, e.g. `k3d-9mp`. The dashboard's PDF Templates page shows each template's ref next to its name; click it to copy. Renders the PDF with that layout instead of the built-in one, and applies only when Output is `pdf`. See [PDF templates](https://docs.beliq.eu/dashboard/pdf-templates/).",
      optional: true,
    },
    inputSource: {
      type: "string",
      label: "Input",
      description: "Where the document comes from, e.g. `file`. `text` reads the XML pasted into Document Text; `file` reads File Path or URL.",
      options: INPUT_SOURCE_OPTIONS,
      default: "text",
    },
    documentText: {
      type: "string",
      label: "Document Text",
      description: "The invoice XML as text, used when Input is `text`, e.g. `<?xml version=\"1.0\" encoding=\"UTF-8\"?><ubl:Invoice xmlns:ubl=\"urn:oasis:names:specification:ubl:schema:xsd:Invoice-2\">...</ubl:Invoice>`. With XML output, **Generate Invoice** returns the XML it produced in its `xml` field.",
      optional: true,
    },
    filePath: {
      type: "string",
      format: "file-ref",
      label: "File Path or URL",
      description: "An XML or PDF invoice file, used when Input is `file`: a path in `/tmp` or a URL, e.g. `/tmp/invoice.xml` or `https://example.com/invoice.pdf`. **Generate Invoice** and **Convert Invoice** return the `path` of the file they wrote.",
      optional: true,
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The input document's content type, e.g. `application/pdf`. `auto` (the default) detects it from the document's first bytes.",
      options: CONTENT_TYPE_OPTIONS,
      optional: true,
      default: "auto",
    },
    validateFormat: {
      type: "string",
      label: "Format",
      description: "The syntax of the document, e.g. `cii` for Factur-X, ZUGFeRD or a CII XRechnung, `ubl` for Peppol BIS or a UBL XRechnung. `auto` (the default) detects it.",
      options: VALIDATE_FORMAT_OPTIONS,
      optional: true,
      default: "auto",
    },
    parseFormat: {
      type: "string",
      label: "Format",
      description: "The syntax of the document, e.g. `cii` for Factur-X, ZUGFeRD or a CII XRechnung, `ubl` for Peppol BIS or a UBL XRechnung. `auto` (the default) detects it.",
      options: PARSE_FORMAT_OPTIONS,
      optional: true,
      default: "auto",
    },
    franceCtc: {
      type: "boolean",
      label: "Apply France CTC Overlay",
      description: "Also check the French CTC (Flux 2) rules on top of the standard's own, e.g. `true` for an invoice under the French B2B reform. Defaults to `false`.",
      optional: true,
      default: false,
    },
    sourceFormat: {
      type: "string",
      label: "Source Format",
      description: "The format of the input document, e.g. `facturx`. `auto` (the default) detects it.",
      options: CONVERT_SOURCE_OPTIONS,
      optional: true,
      default: "auto",
    },
    targetFormat: {
      type: "string",
      label: "Target Format",
      description: "The format to convert the document to, e.g. `ubl` or `xrechnung`.",
      options: CONVERT_TARGET_OPTIONS,
      default: "ubl",
    },
    targetProfile: {
      type: "string",
      label: "Target Profile",
      description: "The Factur-X or ZUGFeRD profile of the result, e.g. `en16931`. Applied only when Target Format is Factur-X or ZUGFeRD.",
      options: PROFILE_OPTIONS,
      optional: true,
      default: "en16931",
    },
    dropFranceCtcOverlay: {
      type: "boolean",
      label: "Drop France CTC Overlay",
      description: "Drop the French CTC overlay when the target format cannot carry it, e.g. `true` to convert a French CTC Factur-X to UBL. The dropped overlay is listed in the result. Defaults to `false`, which fails with `CONVERSION_LOSSY_FAILCLOSED` instead.",
      optional: true,
      default: false,
    },
    filename: {
      type: "string",
      label: "Filename",
      description: "The name of the file written to `/tmp`, e.g. `INV-2026-001.xml`. Defaults to `invoice` or `converted` plus the extension the result needs.",
      optional: true,
    },
    advanced: {
      type: "object",
      label: "Advanced (JSON)",
      description: "Raw fields deep-merged into the request, for any option the other fields do not cover. Example: `{ \"someField\": \"value\" }`.",
      optional: true,
    },
  },
  methods: {
    /** A beliq SDK client for the connected account. The API host is fixed. */
    _client() {
      return new Beliq({
        apiKey: this.$auth.api_key,
      });
    },
    /**
     * Run one SDK operation and turn a failure into a readable error. The SDK
     * owns the wire format (raw-body upload, content-type sniff, the
     * `{ success, data, error }` envelope), so every action shares one transport.
     */
    async _makeRequest(operation) {
      try {
        return await operation(this._client());
      } catch (error) {
        throw mapError(error);
      }
    },
    /** Read the account, plan and remaining quota. Costs no quota. */
    getAccount() {
      return this._makeRequest((client) => client.me());
    },
    /** Build an e-invoice document from an EN 16931 invoice object. */
    generateInvoice(input) {
      return this._makeRequest((client) => client.generate(input));
    },
    /** Validate an XML or PDF invoice document and return the verdict. */
    validateInvoice({
      document, ...options
    }) {
      return this._makeRequest((client) => client.validate(document, options));
    },
    /** Extract a structured invoice object from an XML or PDF document. */
    parseInvoice({
      document, ...options
    }) {
      return this._makeRequest((client) => client.parse(document, options));
    },
    /** Convert an invoice document to another format. */
    convertInvoice({
      document, ...options
    }) {
      return this._makeRequest((client) => client.convert(document, options));
    },
  },
};
