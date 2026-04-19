import { ConfigurationError } from "@pipedream/platform";
import obolus from "../app/obolus.app.mjs";

const API_URL = "https://www.obolusfinanz.de/api/taxcompare";
const COUNTRY_OPTIONS = [
  "DE",
  "AT",
  "US",
  "CH",
  "CA",
  "AU",
  "UK",
  "IE",
];

function parseOptionalObject(rawValue, label) {
  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("must be a JSON object");
    }
    return parsed;
  } catch (error) {
    throw new ConfigurationError(`${label} must be a valid JSON object. ${error.message}`);
  }
}

export default {
  key: "obolus-taxcompare",
  name: "Compare Salary Across Countries",
  description: "Compare after-tax income across multiple countries using the same salary input or a local median salary basis.",
  version: "0.0.1",
  type: "action",
  props: {
    obolus,
    gross_mode: {
      type: "string",
      label: "Gross Mode",
      description: "Comparison basis from the Obolus OpenAPI contract.",
      options: [
        "shared_gross",
        "local_median_gross",
      ],
      default: "shared_gross",
    },
    annual_gross: {
      type: "number",
      label: "Annual Gross Salary",
      description: "Annual gross salary in major currency units, e.g. 60000. Optional when gross mode is local_median_gross.",
      optional: true,
    },
    tax_year: {
      type: "string",
      label: "Tax Year",
      description: "Tax year for the comparison, e.g. 2026.",
      default: "2026",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency code in lower-case ISO style.",
      options: [
        "eur",
        "usd",
        "chf",
        "cad",
        "aud",
        "gbp",
      ],
      default: "eur",
    },
    countries: {
      type: "string[]",
      label: "Countries",
      description: "Country codes to compare, e.g. DE, AT, CH, AU.",
      options: COUNTRY_OPTIONS,
      default: [
        "DE",
        "AT",
        "CH",
        "AU",
      ],
    },
    show_advanced_inputs: {
      type: "boolean",
      label: "Show Advanced Inputs",
      description: "Reveal additional taxcompare inputs such as joint assessment, children, and raw JSON overrides.",
      optional: true,
      reloadProps: true,
      default: false,
    },
  },
  async additionalProps() {
    if (!this.show_advanced_inputs) {
      return {};
    }

    return {
      joint_assessment: {
        type: "boolean",
        label: "Joint Assessment",
        description: "Apply joint filing / joint assessment where supported.",
        optional: true,
      },
      children: {
        type: "integer",
        label: "Children",
        description: "Number of children for the comparison.",
        optional: true,
      },
      request_overrides: {
        type: "string",
        label: "JSON Overrides",
        description: "Optional JSON object merged into the taxcompare payload for forward compatibility with new OpenAPI fields.",
        optional: true,
      },
    };
  },
  async run({ $ }) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.obolus.apiKey) {
      headers["x-public-api-key"] = this.obolus.apiKey;
    }

    const requestOverrides = parseOptionalObject(this.request_overrides, "JSON Overrides");
    const effectiveAnnualGross = this.annual_gross ?? requestOverrides.annual_gross;

    if (effectiveAnnualGross !== undefined && !Number.isFinite(effectiveAnnualGross)) {
      throw new ConfigurationError("Annual Gross Salary must be a valid number.");
    }

    if (effectiveAnnualGross !== undefined && effectiveAnnualGross < 0) {
      throw new ConfigurationError("Annual Gross Salary must not be negative.");
    }

    if (this.gross_mode !== "local_median_gross" && effectiveAnnualGross === undefined) {
      throw new ConfigurationError("Annual Gross Salary is required unless Gross Mode is local_median_gross.");
    }

    const payload = {
      gross_mode: this.gross_mode,
      tax_year: this.tax_year,
      countries: this.countries,
      currency: this.currency,
      ...requestOverrides,
    };

    if (effectiveAnnualGross !== undefined) {
      payload.annual_gross = effectiveAnnualGross;
    }
    if (this.joint_assessment !== undefined) {
      payload.joint_assessment = this.joint_assessment;
    }
    if (this.children !== undefined) {
      payload.children = this.children;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Obolus taxcompare failed: ${response.status} ${text}`);
    }

    const data = await response.json();

    $.export("$summary", `Compared salary across ${payload.countries.length} countries using ${payload.gross_mode}.`);

    return data;
  },
};
