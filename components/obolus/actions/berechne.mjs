import { ConfigurationError } from "@pipedream/platform";
import obolus from "../app/obolus.app.mjs";

const API_URL = "https://www.obolusfinanz.de/api/berechne";
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
    prop: "geldwerter_vorteil",
    apiKey: "Geldwerter_Vorteil",
    type: "integer",
    label: "Geldwerter Vorteil",
    description: "Raw Obolus API field `Geldwerter_Vorteil` in minor units.",
  },
  {
    prop: "pre_tax_deduction_ct",
    apiKey: "PreTax_Deduction_ct",
    type: "integer",
    label: "Pre-Tax Deduction",
    description: "Raw Obolus API field `PreTax_Deduction_ct` in minor units.",
  },
  {
    prop: "sonstige_bezuege",
    apiKey: "Sonstige_Bezuege",
    type: "integer",
    label: "Sonstige Bezuege",
    description: "Raw Obolus API field `Sonstige_Bezuege` in minor units.",
  },
  {
    prop: "gesetzliche_rv",
    apiKey: "gesetzliche_RV",
    type: "integer",
    label: "Gesetzliche RV",
    description: "Raw Obolus API field `gesetzliche_RV`, typically `1` or `0` depending on pension insurance status.",
  },
  {
    prop: "gesetzliche_kvpv_status",
    apiKey: "gesetzlicheKvPvStatus",
    type: "integer",
    label: "Gesetzliche KV/PV Status",
    description: "Raw Obolus API field `gesetzlicheKvPvStatus` for German statutory health / care insurance mode.",
  },
  {
    prop: "pendler_km",
    apiKey: "Pendler_KM",
    type: "integer",
    label: "Pendler KM",
    description: "Raw Obolus API field `Pendler_KM` for commuter distance in kilometers.",
  },
  {
    prop: "pendler_tage",
    apiKey: "Pendler_Tage",
    type: "integer",
    label: "Pendler Tage",
    description: "Raw Obolus API field `Pendler_Tage` for commuter days.",
  },
];

function buildPersonAdvancedProps(prefix, labelPrefix) {
  return PERSON_ADVANCED_FIELDS.reduce((props, field) => ({
    ...props,
    [`${prefix}_${field.prop}`]: {
      type: field.type,
      label: `${labelPrefix} ${field.label}`,
      description: field.description,
      optional: true,
    },
  }), {});
}

function buildPersonAdvancedOverrides(ctx, prefix) {
  return PERSON_ADVANCED_FIELDS.reduce((overrides, field) => {
    const value = ctx[`${prefix}_${field.prop}`];
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
  description: "Calculate net salary, taxes, and social contributions for one or two persons using the Obolus API. Returns the full berechne response object documented by the current OpenAPI contract.",
  version: "0.1.1",
  type: "action",
  props: {
    obolus,
    country: {
      type: "string",
      label: "Country",
      description: "Root country code for the calculation, e.g. DE.",
      default: "DE",
    },
    tax_year: {
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
    payroll_period: {
      type: "integer",
      label: "Payroll Period",
      description: "Top-level LZZ value. Commonly 1=year, 2=month, 3=week depending on country logic.",
      default: 1,
    },
    gross_annual: {
      type: "number",
      label: "Person 1 Annual Gross Salary",
      description: "Annual gross salary in major units, e.g. 60000.",
    },
    tax_class: {
      type: "integer",
      label: "Person 1 Tax Class",
      description: "Country-specific tax class / filing status value.",
      default: 1,
    },
    birth_year: {
      type: "integer",
      label: "Person 1 Birth Year",
      description: "Birth year of the first person.",
      default: 1990,
    },
    include_second_person: {
      type: "boolean",
      label: "Include Person 2",
      description: "Enable a second person and switch Modus to 2.",
      optional: true,
      default: false,
      reloadProps: true,
    },
    second_gross_annual: {
      type: "number",
      label: "Person 2 Annual Gross Salary",
      description: "Annual gross salary for the second person in major units.",
      optional: true,
    },
    second_tax_class: {
      type: "integer",
      label: "Person 2 Tax Class",
      description: "Country-specific tax class / filing status value for the second person.",
      optional: true,
    },
    second_birth_year: {
      type: "integer",
      label: "Person 2 Birth Year",
      description: "Birth year of the second person.",
      optional: true,
    },
    show_advanced_inputs: {
      type: "boolean",
      label: "Show Advanced Inputs",
      description: "Reveal additional Obolus OpenAPI fields for advanced and country-specific payroll scenarios.",
      optional: true,
      reloadProps: true,
      default: false,
    },
  },
  async additionalProps() {
    if (!this.show_advanced_inputs) {
      return {};
    }

    const props = {
      global_factor: {
        type: "number",
        label: "Global Factor",
        description: "Top-level Obolus field `Faktor` for factor-based workflows.",
        optional: true,
      },
      child_allowance_factor: {
        type: "integer",
        label: "Child Allowance Factor",
        description: "Top-level Obolus field `KinderFRB`.",
        optional: true,
      },
      child_count_for_care_insurance: {
        type: "integer",
        label: "Children For Care Insurance",
        description: "Top-level Obolus field `KinderPVA`.",
        optional: true,
      },
      child_benefit: {
        type: "number",
        label: "Child Benefit",
        description: "Top-level Obolus field `Kindergeld` in major units.",
        optional: true,
      },
      person1_overrides: {
        type: "string",
        label: "Person 1 JSON Overrides",
        description: "Optional JSON object merged into person 1 for full OpenAPI coverage beyond the curated advanced fields.",
        optional: true,
      },
      request_overrides: {
        type: "string",
        label: "Top-Level JSON Overrides",
        description: "Optional JSON object merged into the top-level berechne payload. Do not include `Personen` here.",
        optional: true,
      },
      ...buildPersonAdvancedProps("person1", "Person 1"),
    };

    if (this.include_second_person) {
      props.person2_overrides = {
        type: "string",
        label: "Person 2 JSON Overrides",
        description: "Optional JSON object merged into person 2 for full OpenAPI coverage beyond the curated advanced fields.",
        optional: true,
      };

      Object.assign(props, buildPersonAdvancedProps("person2", "Person 2"));
    }

    return props;
  },
  async run({ $ }) {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.obolus.apiKey) {
      headers["x-public-api-key"] = this.obolus.apiKey;
    }

    const requestOverrides = parseOptionalObject(this.request_overrides, "Top-Level JSON Overrides");
    const person1DirectOverrides = buildPersonAdvancedOverrides(this, "person1");
    const person2DirectOverrides = buildPersonAdvancedOverrides(this, "person2");
    const person1Overrides = {
      ...parseOptionalObject(this.person1_overrides, "Person 1 JSON Overrides"),
      ...person1DirectOverrides,
    };
    const person2Overrides = {
      ...parseOptionalObject(this.person2_overrides, "Person 2 JSON Overrides"),
      ...person2DirectOverrides,
    };

    if ("Personen" in requestOverrides) {
      throw new ConfigurationError("Top-Level JSON Overrides must not include Personen. Use the person override fields instead.");
    }

    const person1 = {
      Land: this.country,
      Gehalt_ct: toMinorUnits(this.gross_annual, "Person 1 Annual Gross Salary"),
      Gehalt_ct_ohne_Sonst: toMinorUnits(this.gross_annual, "Person 1 Annual Gross Salary"),
      Steuerklasse: this.tax_class,
      Geburtsjahr: this.birth_year,
      ...person1Overrides,
    };

    const hasSecondPerson =
      this.include_second_person ||
      Object.keys(person2Overrides).length > 0 ||
      this.second_gross_annual !== undefined ||
      this.second_tax_class !== undefined ||
      this.second_birth_year !== undefined;

    const people = [
      person1,
    ];

    if (hasSecondPerson) {
      const person2 = {
        Land: this.country,
        ...person2Overrides,
      };

      setIfDefined(person2, "Gehalt_ct", toMinorUnits(this.second_gross_annual, "Person 2 Annual Gross Salary", { optional: true }));
      setIfDefined(person2, "Gehalt_ct_ohne_Sonst", toMinorUnits(this.second_gross_annual, "Person 2 Annual Gross Salary", { optional: true }));
      setIfDefined(person2, "Steuerklasse", this.second_tax_class);
      setIfDefined(person2, "Geburtsjahr", this.second_birth_year);

      for (const key of [
        "Land",
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
      Stjahr: this.tax_year,
      Currency: this.currency,
      LZZ: this.payroll_period,
      Modus: people.length,
      ...requestOverrides,
      Personen: people,
    };

    setIfDefined(payload, "Faktor", this.global_factor);
    setIfDefined(payload, "KinderFRB", this.child_allowance_factor);
    setIfDefined(payload, "KinderPVA", this.child_count_for_care_insurance);
    setIfDefined(payload, "Kindergeld", toMinorUnits(this.child_benefit, "Child Benefit", { optional: true }));
    payload.Modus = people.length;

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Obolus berechne failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    const scope = people.length === 1 ? "1 person" : "2 persons";

    $.export("$summary", `Calculated net salary for ${payload.Land} (${payload.Stjahr}) for ${scope}.`);

    return data;
  },
};
