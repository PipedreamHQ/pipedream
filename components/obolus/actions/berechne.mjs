import { ConfigurationError } from "@pipedream/platform";
import obolus from "../app/obolus.app.mjs";

const PERSON_ADVANCED_FIELDS = [
  {
    prop: "dePayrollPreset",
    apiKey: "de_payroll_preset",
    type: "string",
    label: "German Payroll Preset",
    description: "Preferred semantic German payroll preset. For a normal employee choose `DE_STANDARD_EMPLOYEE_STATUTORY`; the action maps it to Obolus internal inverse flags before calling the API.",
    options: [
      {
        label: "Standard employee - statutory pension and statutory health",
        value: "DE_STANDARD_EMPLOYEE_STATUTORY",
      },
      {
        label: "Private health insurance",
        value: "DE_PRIVATE_HEALTH_INSURANCE",
      },
      {
        label: "Pension/unemployment exempt",
        value: "DE_PENSION_EXEMPT",
      },
      {
        label: "Pension exempt + private health",
        value: "DE_PENSION_EXEMPT_PRIVATE_HEALTH",
      },
    ],
    default: "DE_STANDARD_EMPLOYEE_STATUTORY",
    countries: ["DE"],
  },
  {
    prop: "dePrivateHealthEmployeeContributionCt",
    apiKey: "de_private_health_employee_contribution_ct",
    type: "integer",
    label: "German Private Health Contribution (minor units)",
    description: "Employee private health insurance contribution for the selected payroll period in minor units. Required when private health insurance is selected; leave empty or 0 for statutory GKV/PV.",
    optional: true,
    countries: ["DE"],
  },
  {
    prop: "deHealthExtraContributionPercent",
    apiKey: "de_health_extra_contribution_percent",
    type: "number",
    label: "German Health Extra Contribution %",
    description: "German statutory health insurance Zusatzbeitrag as literal percent points, e.g. `2.5` for 2.5%. Do not enter `25`, `250`, basis points, or cents.",
    default: 2.5,
    countries: ["DE"],
  },
  {
    prop: "bundesland",
    apiKey: "Bundesland",
    type: "string",
    label: "Bundesland",
    description: "Raw Obolus API field `Bundesland` for state / canton / region.",
  },
  {
    prop: "lohnzahlungszeitraum",
    apiKey: "Lohnzahlungszeitraum",
    type: "integer",
    label: "Lohnzahlungszeitraum",
    description: "Raw Obolus API field `Lohnzahlungszeitraum` for the person-specific payroll period.",
  },
  {
    prop: "kirche",
    apiKey: "Kirche",
    type: "integer",
    label: "Kirche",
    description: "Raw Obolus API field `Kirche`, typically `1` for church tax and `0` otherwise.",
  },
  {
    prop: "kinderpva",
    apiKey: "KinderPVA",
    type: "integer",
    label: "KinderPVA",
    description: "Raw Obolus API field `KinderPVA` for child count relevant to care insurance logic.",
  },
  {
    prop: "kinderfreibetrag",
    apiKey: "Kinderfreibetrag",
    type: "number",
    label: "Kinderfreibetrag",
    description: "Raw Obolus API field `Kinderfreibetrag` for the person's child allowance share.",
  },
  {
    prop: "geldwerterVorteil",
    apiKey: "Geldwerter_Vorteil",
    type: "integer",
    label: "Geldwerter Vorteil",
    description: "Raw Obolus API field `Geldwerter_Vorteil` in minor units.",
  },
  {
    prop: "preTaxDeductionCt",
    apiKey: "PreTax_Deduction_ct",
    type: "integer",
    label: "Pre-Tax Deduction",
    description: "Raw Obolus API field `PreTax_Deduction_ct` in minor units.",
  },
  {
    prop: "sonstigeBezuege",
    apiKey: "Sonstige_Bezuege",
    type: "integer",
    label: "Sonstige Bezuege",
    description: "Raw Obolus API field `Sonstige_Bezuege` in minor units.",
  },
  {
    prop: "pendlerKm",
    apiKey: "Pendler_KM",
    type: "integer",
    label: "Pendler KM",
    description: "Raw Obolus API field `Pendler_KM` for commuter distance in kilometers.",
  },
  {
    prop: "pendlerTage",
    apiKey: "Pendler_Tage",
    type: "integer",
    label: "Pendler Tage",
    description: "Raw Obolus API field `Pendler_Tage` for commuter days.",
  },
];

function buildAdvancedPropName(prefix, prop) {
  return `${prefix}${prop.charAt(0).toUpperCase()}${prop.slice(1)}`;
}

function fieldAppliesToCountry(field, country) {
  return !field.countries || field.countries.includes(country);
}

function buildPersonAdvancedProps(prefix, labelPrefix, country) {
  return PERSON_ADVANCED_FIELDS
    .filter((field) => fieldAppliesToCountry(field, country))
    .reduce((props, field) => ({
    ...props,
    [buildAdvancedPropName(prefix, field.prop)]: {
      type: field.type,
      label: `${labelPrefix} ${field.label}`,
      description: field.description,
      ...(field.options
        ? {
          options: field.options,
        }
        : {}),
      ...(field.default !== undefined
        ? {
          default: field.default,
        }
        : {}),
      optional: true,
    },
  }), {});
}

function buildPersonAdvancedOverrides(ctx, prefix) {
  return PERSON_ADVANCED_FIELDS
    .filter((field) => fieldAppliesToCountry(field, ctx.country))
    .reduce((overrides, field) => {
    const value = ctx[buildAdvancedPropName(prefix, field.prop)];
    if (value !== undefined && value !== null && value !== "") {
      overrides[field.apiKey] = value;
    }
    return overrides;
  }, {});
}

function toMinorUnits(value, label, { optional = false } = {}) {
  if (value === undefined || value === null || value === "") {
    if (optional) {
      return undefined;
    }
    throw new ConfigurationError(`${label} is required.`);
  }

  if (!Number.isFinite(value)) {
    throw new ConfigurationError(`${label} must be a valid number.`);
  }

  if (value < 0) {
    throw new ConfigurationError(`${label} must not be negative.`);
  }

  return Math.round(value * 100);
}

function toPayrollPeriodMinorUnits(value, label, payrollPeriod, { optional = false } = {}) {
  const annualMinorUnits = toMinorUnits(value, label, {
    optional,
  });

  if (annualMinorUnits === undefined) {
    return undefined;
  }

  const periodDivisors = {
    1: 1,
    2: 12,
    3: 52,
    4: 260,
  };
  const divisor = periodDivisors[Number(payrollPeriod)];

  if (!divisor) {
    throw new ConfigurationError("Payroll Period must be one of 1=year, 2=month, 3=week, or 4=day.");
  }

  return Math.round(annualMinorUnits / divisor);
}

function setIfDefined(target, key, value) {
  if (value !== undefined && value !== null && value !== "") {
    target[key] = value;
  }
}

function getGermanStandardEmployeeDefaults(country) {
  if (country !== "DE") {
    return {};
  }

  return {
    de_payroll_preset: "DE_STANDARD_EMPLOYEE_STATUTORY",
    de_health_extra_contribution_percent: 2.5,
    Kirche: 0,
    KinderPVA: 0,
    Kinderfreibetrag: 0,
  };
}

function formatGermanPercentSuggestion(value) {
  if (!Number.isFinite(value) || value <= 10) {
    return null;
  }

  const divisor = value <= 100 ? 10 : 100;
  const suggestion = value / divisor;
  if (suggestion <= 0 || suggestion > 10) {
    return null;
  }

  return Number.isInteger(suggestion)
    ? String(suggestion)
    : suggestion.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function validateGermanPayrollInputs(person, label, country) {
  if (country !== "DE") {
    return;
  }

  for (const [field, rawValue] of [
    ["German Health Extra Contribution %", person.de_health_extra_contribution_percent],
    ["Legacy KVZ", person.KVZ],
  ]) {
    const value = Number(rawValue);
    const suggestion = formatGermanPercentSuggestion(value);
    if (suggestion) {
      throw new ConfigurationError(`${label} ${field} is ${value}, but Obolus expects literal percent points. Did you mean ${suggestion} for ${suggestion}%?`);
    }
  }

  const pensionExempt =
    person.de_payroll_preset === "DE_PENSION_EXEMPT" ||
    person.de_payroll_preset === "DE_PENSION_EXEMPT_PRIVATE_HEALTH" ||
    person.de_statutory_pension_and_unemployment === false ||
    person.de_pension_insurance === "exempt";

  if (Number(person.gesetzliche_RV) === 1 && !pensionExempt) {
    throw new ConfigurationError(`${label} has raw gesetzliche_RV=1, which disables statutory pension/unemployment. Use German Payroll Preset = DE_PENSION_EXEMPT only when that is intended; otherwise use DE_STANDARD_EMPLOYEE_STATUTORY.`);
  }

  const privateHealth =
    person.de_payroll_preset === "DE_PRIVATE_HEALTH_INSURANCE" ||
    person.de_payroll_preset === "DE_PENSION_EXEMPT_PRIVATE_HEALTH" ||
    person.de_statutory_health_and_care === false ||
    person.de_health_insurance === "private" ||
    Number(person.gesetzlicheKvPvStatus) === 1 ||
    Number(person.KV_Art) === 1;

  if (
    person.gesetzlicheKvPvStatus !== undefined &&
    person.KV_Art !== undefined &&
    Number(person.gesetzlicheKvPvStatus) !== Number(person.KV_Art)
  ) {
    throw new ConfigurationError(`${label} has mismatched raw German health flags. Use the German Payroll Preset or German Statutory Health/Care fields instead.`);
  }

  const privateContribution =
    Number(person.de_private_health_employee_contribution_ct) ||
    Number(person.AN_Beitraege_PKV) ||
    Number(person["AN_Beitr\u00e4ge_PKV"]) ||
    Number(person["AN_BeitrÃ¤ge_PKV"]) ||
    0;

  if (privateHealth && privateContribution <= 0) {
    throw new ConfigurationError(`${label} selects German private health insurance but has no positive private health contribution. Provide German Private Health Contribution (minor units), or use DE_STANDARD_EMPLOYEE_STATUTORY for statutory GKV/PV.`);
  }
}

export default {
  key: "obolus-berechne",
  name: "Calculate Net Salary",
  description: "Calculate net salary, taxes, and social contributions for one or two people using the Obolus API. [See the documentation](https://www.obolusfinanz.de/en/developers)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    obolus,
    country: {
      propDefinition: [
        obolus,
        "country",
      ],
    },
    taxYear: {
      type: "integer",
      label: "Tax Year",
      description: "Tax year, e.g. 2026.",
      default: 2026,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency code in upper-case ISO style.",
      options: [
        "EUR",
        "USD",
        "CHF",
        "CAD",
        "AUD",
        "GBP",
      ],
      default: "EUR",
    },
    payrollPeriod: {
      type: "integer",
      label: "Payroll Period",
      description: "Top-level LZZ value. 1=year, 2=month, 3=week, 4=day. Direct salary inputs are annual gross amounts; this action converts them to the selected payroll period before calling Obolus.",
      default: 1,
    },
    grossAnnual: {
      type: "number",
      label: "Person 1 Annual Gross Salary",
      description: "Annual gross salary in major units, e.g. 60000.",
    },
    taxClass: {
      type: "integer",
      label: "Person 1 Tax Class",
      description: "Country-specific tax class / filing status value.",
      default: 1,
    },
    birthYear: {
      type: "integer",
      label: "Person 1 Birth Year",
      description: "Birth year of the first person.",
      default: 1990,
    },
    includeSecondPerson: {
      type: "boolean",
      label: "Include Person 2",
      description: "Enable a second person and switch Modus to 2.",
      optional: true,
      default: false,
      reloadProps: true,
    },
    showAdvancedInputs: {
      type: "boolean",
      label: "Show Advanced Inputs",
      description: "Reveal additional Obolus OpenAPI fields for advanced and country-specific payroll scenarios.",
      optional: true,
      reloadProps: true,
      default: false,
    },
  },
  async additionalProps() {
    const props = {};

    if (this.includeSecondPerson) {
      Object.assign(props, {
        secondGrossAnnual: {
          type: "number",
          label: "Person 2 Annual Gross Salary",
          description: "Annual gross salary for the second person in major units.",
          optional: true,
        },
        secondTaxClass: {
          type: "integer",
          label: "Person 2 Tax Class",
          description: "Country-specific tax class / filing status value for the second person.",
          optional: true,
        },
        secondBirthYear: {
          type: "integer",
          label: "Person 2 Birth Year",
          description: "Birth year of the second person.",
          optional: true,
        },
      });
    }

    if (!this.showAdvancedInputs) {
      return props;
    }

    Object.assign(props, {
      globalFactor: {
        type: "number",
        label: "Global Factor",
        description: "Advanced top-level factor field.",
        optional: true,
      },
      childAllowanceFactor: {
        type: "integer",
        label: "Child Allowance Factor",
        description: "Advanced top-level child allowance factor.",
        optional: true,
      },
      childCountForCareInsurance: {
        type: "integer",
        label: "Children For Care Insurance",
        description: "Advanced top-level child count for care insurance logic.",
        optional: true,
      },
      childBenefit: {
        type: "number",
        label: "Child Benefit",
        description: "Advanced top-level child benefit in major units.",
        optional: true,
      },
      person1Overrides: {
        type: "string",
        label: "Person 1 JSON Overrides",
        description: "Optional JSON object merged into person 1 for edge cases and forward compatibility. Prefer readable German aliases, e.g. {\"de_health_extra_contribution_percent\":2.9,\"de_health_insurance\":\"statutory\"}.",
        optional: true,
      },
      requestOverrides: {
        type: "string",
        label: "Top-Level JSON Overrides",
        description: "Optional JSON object merged into the top-level berechne payload. Do not include `Personen`. Example: {\"Faktor\":0.95,\"KinderFRB\":1}",
        optional: true,
      },
      ...buildPersonAdvancedProps("person1", "Person 1", this.country),
    });

    if (this.includeSecondPerson) {
      props.person2Overrides = {
        type: "string",
        label: "Person 2 JSON Overrides",
        description: "Optional JSON object merged into person 2 for edge cases and forward compatibility. Prefer readable German aliases, e.g. {\"de_pension_insurance\":\"statutory\",\"de_health_insurance\":\"statutory\"}.",
        optional: true,
      };

      Object.assign(props, buildPersonAdvancedProps("person2", "Person 2", this.country));
    }

    return props;
  },
  async run({ $ }) {
    const requestOverrides = this.obolus.parseJsonObject(this.requestOverrides, "Top-Level JSON Overrides");
    const person1DirectOverrides = buildPersonAdvancedOverrides(this, "person1");
    const person2DirectOverrides = buildPersonAdvancedOverrides(this, "person2");
    const person1Overrides = {
      ...this.obolus.parseJsonObject(this.person1Overrides, "Person 1 JSON Overrides"),
      ...person1DirectOverrides,
    };
    const person2Overrides = {
      ...this.obolus.parseJsonObject(this.person2Overrides, "Person 2 JSON Overrides"),
      ...person2DirectOverrides,
    };

    if ("Personen" in requestOverrides || "Modus" in requestOverrides) {
      throw new ConfigurationError("Top-Level JSON Overrides must not include Personen or Modus. Use the person override fields instead.");
    }

    const person1GrossMinor = toPayrollPeriodMinorUnits(this.grossAnnual, "Person 1 Annual Gross Salary", this.payrollPeriod);
    const person1 = {
      ...getGermanStandardEmployeeDefaults(this.country),
      ...person1Overrides,
      Land: this.country,
      Gehalt_ct: person1GrossMinor,
      Gehalt_ct_ohne_Sonst: person1Overrides.Gehalt_ct_ohne_Sonst ?? person1GrossMinor,
      Steuerklasse: this.taxClass,
      Geburtsjahr: this.birthYear,
    };

    const people = [
      person1,
    ];

    if (this.includeSecondPerson) {
      const person2GrossMinor = toPayrollPeriodMinorUnits(this.secondGrossAnnual, "Person 2 Annual Gross Salary", this.payrollPeriod, {
        optional: true,
      });
      const person2 = {
        ...getGermanStandardEmployeeDefaults(this.country),
        ...person2Overrides,
        Land: this.country,
      };

      setIfDefined(person2, "Gehalt_ct", person2GrossMinor);
      if (person2.Gehalt_ct_ohne_Sonst === undefined) {
        setIfDefined(person2, "Gehalt_ct_ohne_Sonst", person2GrossMinor);
      }
      setIfDefined(person2, "Steuerklasse", this.secondTaxClass);
      setIfDefined(person2, "Geburtsjahr", this.secondBirthYear);

      for (const key of [
        "Gehalt_ct",
        "Steuerklasse",
        "Geburtsjahr",
      ]) {
        if (person2[key] === undefined || person2[key] === null || person2[key] === "") {
          throw new ConfigurationError(`Person 2 is enabled, so ${key} must be provided either directly or via Person 2 JSON Overrides.`);
        }
      }

      if (person2.Gehalt_ct_ohne_Sonst === undefined && person2.Gehalt_ct !== undefined) {
        person2.Gehalt_ct_ohne_Sonst = person2.Gehalt_ct;
      }

      people.push(person2);
    }

    validateGermanPayrollInputs(person1, "Person 1", this.country);
    if (this.includeSecondPerson) {
      validateGermanPayrollInputs(people[1], "Person 2", this.country);
    }

    const payload = {
      Land: this.country,
      Stjahr: this.taxYear,
      Currency: this.currency,
      LZZ: this.payrollPeriod,
      Modus: people.length,
      ...requestOverrides,
      Personen: people,
    };

    setIfDefined(payload, "Faktor", this.globalFactor);
    setIfDefined(payload, "KinderFRB", this.childAllowanceFactor);
    setIfDefined(payload, "KinderPVA", this.childCountForCareInsurance);
    setIfDefined(payload, "Kindergeld", toMinorUnits(this.childBenefit, "Child Benefit", { optional: true }));

    const data = await this.obolus.calculateNetSalary({
      $,
      data: payload,
    });
    const scope = people.length === 1 ? "1 person" : "2 persons";

    $.export("$summary", `Calculated net salary for ${payload.Land} (${payload.Stjahr}) for ${scope}.`);

    return data;
  },
};
