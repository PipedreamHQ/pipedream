import { ConfigurationError } from "@pipedream/platform";

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
    description: "Raw Obolus API field `Bundesland` for state / canton / region. The valid values and tax effect are country-specific.",
  },
  {
    prop: "lohnzahlungszeitraum",
    apiKey: "Lohnzahlungszeitraum",
    type: "integer",
    label: "Lohnzahlungszeitraum",
    description: "Raw Obolus API field `Lohnzahlungszeitraum` for the person-specific payroll period. Its exact semantics are interpreted by the selected country's payroll rules.",
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
    description: "Raw Obolus API field `KinderPVA` for child count relevant to care insurance logic. This is country-specific and primarily relevant where the selected tax system uses this concept.",
  },
  {
    prop: "kinderfreibetrag",
    apiKey: "Kinderfreibetrag",
    type: "number",
    label: "Kinderfreibetrag",
    description: "Raw Obolus API field `Kinderfreibetrag` for the person's child allowance share. The meaning and valid range are country-specific.",
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

export function buildPersonAdvancedProps(prefix, labelPrefix, country) {
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

export function buildPersonAdvancedOverrides(ctx, prefix) {
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

export function toMinorUnits(value, label, { optional = false } = {}) {
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

export function toPayrollPeriodMinorUnits(value, label, payrollPeriod, { optional = false } = {}) {
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

export function setIfDefined(target, key, value) {
  if (value !== undefined && value !== null && value !== "") {
    target[key] = value;
  }
}

export function getGermanStandardEmployeeDefaults(country) {
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

export function validateGermanPayrollInputs(person, label, country) {
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
    Number(person["AN_Beitr\u00c3\u00a4ge_PKV"]) ||
    0;

  if (privateHealth && privateContribution <= 0) {
    throw new ConfigurationError(`${label} selects German private health insurance but has no positive private health contribution. Provide German Private Health Contribution (minor units), or use DE_STANDARD_EMPLOYEE_STATUTORY for statutory GKV/PV.`);
  }
}
