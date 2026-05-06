import { ConfigurationError } from "@pipedream/platform";
import obolus from "../obolus.app.mjs";

export default {
  key: "obolus-taxcompare",
  name: "Compare Salary Across Countries",
  description: "Use this when the user asks to compare salary, net income, tax burden, or social contributions across multiple countries. This is the default action for prompts like \"compare a EUR 50,000 salary in Germany, Ireland, the United States, and Canada\". Do not use Calculate Net Salary for multi-country comparisons unless the user asks for detailed payroll in one specific country. [See the documentation](https://www.obolusfinanz.de/en/developers)",
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
      description: "`shared_gross` compares one annual salary across every selected country. `local_median_gross` ignores Annual Gross Salary and compares country-specific editorial median salary benchmarks.",
      options: [
        "shared_gross",
        "local_median_gross",
      ],
      default: "shared_gross",
    },
    annualGross: {
      type: "number",
      label: "Annual Gross Salary",
      description: "Shared annual gross salary to compare across the selected countries, in major currency units, e.g. `60000` for EUR 60,000. Do not enter cents. Required for `shared_gross`; ignored for `local_median_gross`.",
      optional: true,
    },
    taxYear: {
      type: "string",
      label: "Tax Year",
      description: "Tax year for the cross-country comparison, e.g. 2026.",
      default: "2026",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency for the shared salary input and normalized comparison output, in lower-case ISO style.",
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
      propDefinition: [
        obolus,
        "country",
      ],
      type: "string[]",
      label: "Countries",
      description: "Two or more country codes to compare. Use this list whenever the prompt names multiple countries, e.g. DE, IE, US, CA.",
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
      description: "Reveal broad comparison assumptions such as joint assessment, children, and raw JSON overrides. For detailed country-specific payroll fields, use Calculate Net Salary instead.",
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
        description: "Apply broad joint filing / joint assessment assumptions where supported. This is a simplified cross-country comparison input; for precise country-specific spouse or tax-class handling, use Calculate Net Salary instead.",
        optional: true,
      },
      children: {
        type: "integer",
        label: "Children",
        description: "Number of children for broad cross-country comparison assumptions. Country-specific child allowance, credit, or care-insurance details are simplified for comparability.",
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
    const requestOverrides = this.obolus.parseJsonObject(this.requestOverrides, "JSON Overrides");
    const effectiveAnnualGross = this.annualGross ?? requestOverrides.annual_gross;
    const effectiveChildren = this.children ?? requestOverrides.children;

    if (effectiveAnnualGross !== undefined && !Number.isFinite(effectiveAnnualGross)) {
      throw new ConfigurationError("Annual Gross Salary must be a valid number.");
    }

    if (effectiveAnnualGross !== undefined && effectiveAnnualGross < 0) {
      throw new ConfigurationError("Annual Gross Salary must not be negative.");
    }

    if (this.grossMode !== "local_median_gross" && effectiveAnnualGross === undefined) {
      throw new ConfigurationError("Annual Gross Salary is required unless Gross Mode is local_median_gross.");
    }

    if (effectiveChildren !== undefined && (!Number.isInteger(effectiveChildren) || effectiveChildren < 0)) {
      throw new ConfigurationError("Children must be a non-negative integer.");
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
    if (effectiveChildren !== undefined) {
      payload.children = effectiveChildren;
    }

    const data = await this.obolus.compareSalaryAcrossCountries({
      $,
      data: payload,
    });

    $.export("$summary", `Compared salary across ${payload.countries.length} countries using ${payload.gross_mode}.`);

    return data;
  },
};
