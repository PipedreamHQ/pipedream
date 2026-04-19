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

const PERSON_ADVANCED_FIELDS = [
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
    prop: "kvz",
    apiKey: "KVZ",
    type: "number",
    label: "KVZ",
    description: "Raw Obolus API field `KVZ` for the health insurance supplemental rate.",
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
    prop: "gesetzlicheRv",
    apiKey: "gesetzliche_RV",
    type: "integer",
    label: "Gesetzliche RV",
    description: "Raw Obolus API field `gesetzliche_RV`, typically `1` or `0` depending on pension insurance status.",
  },
  {
    prop: "gesetzlicheKvpvStatus",
    apiKey: "gesetzlicheKvPvStatus",
    type: "integer",
    label: "Gesetzliche KV/PV Status",
    description: "Raw Obolus API field `gesetzlicheKvPvStatus` for German statutory health / care insurance mode.",
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

function buildPersonAdvancedProps(prefix, labelPrefix) {
  return PERSON_ADVANCED_FIELDS.reduce((props, field) => ({
    ...props,
    [buildAdvancedPropName(prefix, field.prop)]: {
      type: field.type,
      label: `${labelPrefix} ${field.label}`,
      description: field.description,
      optional: true,
    },
  }), {});
}

function buildPersonAdvancedOverrides(ctx, prefix) {
  return PERSON_ADVANCED_FIELDS.reduce((overrides, field) => {
    const value = ctx[buildAdvancedPropName(prefix, field.prop)];
    if (value !== undefined && value !== null && value !== "") {
      overrides[field.apiKey] = value;
    }
    return overrides;
  }, {});
}

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

function setIfDefined(target, key, value) {
  if (value !== undefined && value !== null && value !== "") {
    target[key] = value;
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
      type: "string",
      label: "Country",
      description: "Root country code for the calculation, e.g. DE.",
      options: COUNTRY_OPTIONS,
      default: "DE",
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
      description: "Top-level LZZ value. Commonly 1=year, 2=month, 3=week depending on country logic.",
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
        description: "Optional JSON object merged into person 1 for edge cases and forward compatibility. Example: {\"Kirche\":1,\"KVZ\":2.9}",
        optional: true,
      },
      requestOverrides: {
        type: "string",
        label: "Top-Level JSON Overrides",
        description: "Optional JSON object merged into the top-level berechne payload. Do not include `Personen`. Example: {\"Faktor\":0.95,\"KinderFRB\":1}",
        optional: true,
      },
      ...buildPersonAdvancedProps("person1", "Person 1"),
    });

    if (this.includeSecondPerson) {
      props.person2Overrides = {
        type: "string",
        label: "Person 2 JSON Overrides",
        description: "Optional JSON object merged into person 2 for edge cases and forward compatibility. Example: {\"Kirche\":0,\"KinderPVA\":2}",
        optional: true,
      };

      Object.assign(props, buildPersonAdvancedProps("person2", "Person 2"));
    }

    return props;
  },
  async run({ $ }) {
    const requestOverrides = parseOptionalObject(this.requestOverrides, "Top-Level JSON Overrides");
    const person1DirectOverrides = buildPersonAdvancedOverrides(this, "person1");
    const person2DirectOverrides = buildPersonAdvancedOverrides(this, "person2");
    const person1Overrides = {
      ...parseOptionalObject(this.person1Overrides, "Person 1 JSON Overrides"),
      ...person1DirectOverrides,
    };
    const person2Overrides = {
      ...parseOptionalObject(this.person2Overrides, "Person 2 JSON Overrides"),
      ...person2DirectOverrides,
    };

    if ("Personen" in requestOverrides || "Modus" in requestOverrides) {
      throw new ConfigurationError("Top-Level JSON Overrides must not include Personen or Modus. Use the person override fields instead.");
    }

    const person1GrossMinor = toMinorUnits(this.grossAnnual, "Person 1 Annual Gross Salary");
    const person1 = {
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
      const person2GrossMinor = toMinorUnits(this.secondGrossAnnual, "Person 2 Annual Gross Salary", {
        optional: true,
      });
      const person2 = {
        Land: this.country,
        ...person2Overrides,
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
