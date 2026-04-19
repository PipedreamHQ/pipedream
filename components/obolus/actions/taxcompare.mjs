import { ConfigurationError } from "@pipedream/platform";
import obolus from "../app/obolus.app.mjs";

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
  description: "Compare after-tax income across multiple countries using the same salary input or a local median salary basis. [See the documentation](https://www.obolusfinanz.de/en/developers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    obolus,
    grossMode: {
      type: "string",
      label: "Gross Mode",
      description: "Comparison basis from the Obolus OpenAPI contract.",
      options: [
        "shared_gross",
        "local_median_gross",
      ],
      default: "shared_gross",
    },
    annualGross: {
      type: "number",
      label: "Annual Gross Salary",
      description: "Annual gross salary in major currency units, e.g. 60000. Optional when gross mode is local_median_gross.",
      optional: true,
    },
    taxYear: {
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
    showAdvancedInputs: {
      type: "boolean",
      label: "Show Advanced Inputs",
      description: "Reveal additional taxcompare inputs such as joint assessment, children, and raw JSON overrides.",
      optional: true,
      reloadProps: true,
      default: false,
    },
  },
  async additionalProps() {
    if (!this.showAdvancedInputs) {
      return {};
    }

    return {
      jointAssessment: {
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
      requestOverrides: {
        type: "string",
        label: "JSON Overrides",
        description: "Optional JSON object merged into the taxcompare payload for forward compatibility with new OpenAPI fields. Example: {\"joint_assessment\":true,\"children\":2}",
        optional: true,
      },
    };
  },
  async run({ $ }) {
    const requestOverrides = parseOptionalObject(this.requestOverrides, "JSON Overrides");
    const effectiveAnnualGross = this.annualGross ?? requestOverrides.annual_gross;

    if (effectiveAnnualGross !== undefined && !Number.isFinite(effectiveAnnualGross)) {
      throw new ConfigurationError("Annual Gross Salary must be a valid number.");
    }

    if (effectiveAnnualGross !== undefined && effectiveAnnualGross < 0) {
      throw new ConfigurationError("Annual Gross Salary must not be negative.");
    }

    if (this.grossMode !== "local_median_gross" && effectiveAnnualGross === undefined) {
      throw new ConfigurationError("Annual Gross Salary is required unless Gross Mode is local_median_gross.");
    }

    const payload = {
      gross_mode: this.grossMode,
      tax_year: this.taxYear,
      countries: this.countries,
      currency: this.currency,
      ...requestOverrides,
    };

    if (effectiveAnnualGross !== undefined) {
      payload.annual_gross = effectiveAnnualGross;
    }
    if (this.jointAssessment !== undefined) {
      payload.joint_assessment = this.jointAssessment;
    }
    if (this.children !== undefined) {
      payload.children = this.children;
    }

    const data = await this.obolus.compareSalaryAcrossCountries({
      $,
      data: payload,
    });

    $.export("$summary", `Compared salary across ${payload.countries.length} countries using ${payload.gross_mode}.`);

    return data;
  },
};
