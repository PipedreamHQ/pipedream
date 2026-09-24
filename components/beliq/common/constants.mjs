import {
  LIVE_CONVERT_SOURCE_FORMATS,
  LIVE_CONVERT_TARGET_FORMATS,
  LIVE_GENERATE_PRESETS,
  LIVE_GENERATE_STANDARDS,
  LIVE_PARSE_FORMATS,
  LIVE_PROFILES,
  LIVE_VALIDATE_FORMATS,
} from "@beliq/sdk";
import { toOptions } from "./utils.mjs";

// Dropdown value-spaces are sourced straight from the SDK's LIVE_* lists, the
// publicly-offered subset of the beliq coverage SSOT. Provisional formats the
// API can technically accept stay out of the UI (LPD-1); reach them through the
// Advanced (JSON) field. Labels here are cosmetic only.
const LABELS = {
  "auto": "Auto-detect",
  "cii": "CII",
  "ubl": "UBL",
  "xrechnung": "XRechnung",
  "zugferd": "ZUGFeRD",
  "facturx": "Factur-X",
  "peppol-bis": "Peppol BIS",
  "basicwl": "BASIC WL",
  "en16931": "EN 16931",
  "extended": "EXTENDED",
  "extended-ctc-fr": "EXTENDED CTC FR",
};

// Curated profile presets (e.g. NLCIUS = Peppol BIS + the netherlands-nlcius
// profile) are offered as extra generate targets beside the plain standards; a
// profile preset resolves to its standard + profile at call time.
export const STANDARD_OPTIONS = [
  ...toOptions(LIVE_GENERATE_STANDARDS, LABELS),
  ...LIVE_GENERATE_PRESETS.filter((p) => p.profile).map((p) => ({
    label: p.label,
    value: p.id,
  })),
];

export const PROFILE_OPTIONS = toOptions(LIVE_PROFILES, LABELS);
export const VALIDATE_FORMAT_OPTIONS = toOptions(LIVE_VALIDATE_FORMATS, LABELS);
export const PARSE_FORMAT_OPTIONS = toOptions(LIVE_PARSE_FORMATS, LABELS);
export const CONVERT_SOURCE_OPTIONS = toOptions(LIVE_CONVERT_SOURCE_FORMATS, LABELS);
export const CONVERT_TARGET_OPTIONS = toOptions(LIVE_CONVERT_TARGET_FORMATS, LABELS);

export const OUTPUT_OPTIONS = [
  {
    label: "XML",
    value: "xml",
  },
  {
    // "PDF" without a qualifier: whether it is a hybrid PDF/A-3 or a
    // visualization with no embedded XML depends on the chosen standard, which
    // a static label cannot say. The Output description carries that.
    label: "PDF",
    value: "pdf",
  },
];

export const INPUT_SOURCE_OPTIONS = [
  {
    label: "Text (paste the XML)",
    value: "text",
  },
  {
    label: "File (a /tmp path or a URL)",
    value: "file",
  },
];

export const CONTENT_TYPE_OPTIONS = [
  {
    label: "Auto-detect",
    value: "auto",
  },
  {
    label: "XML",
    value: "application/xml",
  },
  {
    label: "PDF",
    value: "application/pdf",
  },
];

// How many rule findings an error message lists before it is truncated. A
// Pipedream step shows the error text, so the findings have to stay readable;
// XRechnung reports its rules one layer at a time, so the first few are the
// ones worth acting on.
export const MAX_REPORTED_FINDINGS = 5;

// The example in the Invoice description: a self-contained EN 16931 invoice that
// XRechnung accepts. The request schema alone is not enough; BR-DE-2 wants a
// seller contact and PEPPOL-EN16931-R010/R020 want an electronic address on both
// parties. Both parties are German, so 19% German VAT is the right treatment; a
// French buyer would make it a reverse-charge (AE) sale. It is not the prop's
// default, so an agent that omits the invoice gets an error instead of an
// invoice between two fictitious parties. The live smoke generates it on every
// push to main.
export const SAMPLE_INVOICE = {
  number: "INV-2026-001",
  issueDate: "2026-01-15",
  dueDate: "2026-02-14",
  currencyCode: "EUR",
  buyerReference: "991-12345-67",
  seller: {
    name: "Seller GmbH",
    vatId: "DE123456789",
    contactName: "A Person",
    email: "billing@seller.example",
    phone: "+49 30 123456",
    address: {
      street: "Hauptstrasse 1",
      city: "Berlin",
      postalCode: "10115",
      countryCode: "DE",
    },
    peppol: {
      schemeId: "0088",
      id: "4030000000003",
    },
  },
  buyer: {
    name: "Buyer AG",
    vatId: "DE987654321",
    email: "ap@buyer.example",
    address: {
      street: "Jungfernstieg 2",
      city: "Hamburg",
      postalCode: "20354",
      countryCode: "DE",
    },
    peppol: {
      schemeId: "0088",
      id: "4030000000027",
    },
  },
  lines: [
    {
      description: "Consulting services",
      quantity: 10,
      unitCode: "HUR",
      unitPrice: 100,
      lineTotal: 1000,
      vatRate: 19,
      vatCategoryCode: "S",
    },
  ],
  taxSummary: [
    {
      vatCategoryCode: "S",
      vatRate: 19,
      taxableAmount: 1000,
      taxAmount: 190,
    },
  ],
  paymentMeans: {
    typeCode: "58",
    iban: "DE89370400440532013000",
  },
  totalNetAmount: 1000,
  totalTaxAmount: 190,
  totalGrossAmount: 1190,
};
