import { ConfigurationError } from "@pipedream/platform";
import obolus from "../obolus.app.mjs";
import {
  buildPersonAdvancedOverrides,
  buildPersonAdvancedProps,
  getGermanStandardEmployeeDefaults,
  setIfDefined,
  toMinorUnits,
  toPayrollPeriodMinorUnits,
  validateGermanPayrollInputs,
} from "../common/utils.mjs";

export default {
  key: "obolus-berechne",
  name: "Calculate Net Salary",
  description: "Use this only for detailed net salary and payroll calculation for one country and one or two people. Inputs and outputs are country-polymorphic: the same field name can map to different tax, social security, or payroll concepts depending on the selected country and tax system. For comparing salary, tax, or net income across multiple countries, use Compare Salary Across Countries instead. [See the documentation](https://www.obolusfinanz.de/en/developers)",
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
      description: "Country-specific tax year for this detailed payroll calculation, e.g. 2026.",
      default: 2026,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency code in upper-case ISO style for the salary input and payroll output.",
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
      description: "Top-level LZZ value. 1=year, 2=month, 3=week, 4=day. Direct salary inputs are annual gross amounts; this action converts them to the selected payroll period before calling Obolus. Period handling is interpreted by the selected country's payroll rules.",
      default: 1,
    },
    grossAnnual: {
      type: "number",
      label: "Person 1 Annual Gross Salary",
      description: "Person 1 annual gross salary in major units, e.g. 60000. Use Compare Salary Across Countries instead when the task is to compare this salary across multiple countries.",
    },
    taxClass: {
      type: "integer",
      label: "Person 1 Tax Class",
      description: "Country-specific tax class, filing status, or equivalent payroll category. The numeric meaning depends on the selected country.",
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
      description: "Enable a second person and switch Modus to 2 for detailed household payroll in one selected country.",
      optional: true,
      default: false,
      reloadProps: true,
    },
    showAdvancedInputs: {
      type: "boolean",
      label: "Show Advanced Inputs",
      description: "Reveal additional Obolus OpenAPI fields for advanced and country-specific payroll scenarios. These fields are not globally portable; their meaning can change by country and tax system.",
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
          description: "Country-specific tax class, filing status, or equivalent payroll category for the second person. The numeric meaning depends on the selected country.",
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
        description: "Optional JSON object merged into person 1 for edge cases and forward compatibility. Override keys are country-specific and should not be reused across countries unless the Obolus API documents the same meaning. Prefer readable German aliases, e.g. {\"de_health_extra_contribution_percent\":2.9,\"de_health_insurance\":\"statutory\"}.",
        optional: true,
      },
      requestOverrides: {
        type: "string",
        label: "Top-Level JSON Overrides",
        description: "Optional JSON object merged into the top-level berechne payload for country-specific payroll features. Do not include `Personen`. Example: {\"Faktor\":0.95,\"KinderFRB\":1}",
        optional: true,
      },
      ...buildPersonAdvancedProps("person1", "Person 1", this.country),
    });

    if (this.includeSecondPerson) {
      props.person2Overrides = {
        type: "string",
        label: "Person 2 JSON Overrides",
        description: "Optional JSON object merged into person 2 for edge cases and forward compatibility. Override keys are country-specific and should not be reused across countries unless the Obolus API documents the same meaning. Prefer readable German aliases, e.g. {\"de_pension_insurance\":\"statutory\",\"de_health_insurance\":\"statutory\"}.",
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
