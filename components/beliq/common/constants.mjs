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
