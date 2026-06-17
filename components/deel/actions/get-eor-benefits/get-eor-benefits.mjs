import app from "../../deel.app.mjs";

export default {
  key: "deel-get-eor-benefits",
  name: "Get EOR Benefits",
  description:
    "List available EOR (employer of record) benefits offered through Deel for a specific country and employment context."
    + " Returns benefit names, types, descriptions, and availability."
    + " Use this when a user asks about what benefits they can offer EOR employees in a specific country."
    + " `country_code` must be an ISO 3166-1 alpha-2 code (e.g., `DE`, `US`)."
    + " `employment_type` must be one of: `Full-time`, `Part-time`."
    + " `work_hours_per_week` is the number of hours worked per week (e.g., `40`)."
    + " `work_visa` is `true` if the employee requires a work visa."
    + " `team_id` and `legal_entity_id` are required — retrieve from your Deel organization settings."
    + " [See the documentation](https://developer.deel.com/api/reference/endpoints/eor-hiring/get-benefits)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    countryCode: {
      propDefinition: [
        app,
        "countryCode",
      ],
      description: "ISO 3166-1 alpha-2 country code to filter benefits by (e.g., `DE`, `US`, `GB`).",
    },
    employmentType: {
      type: "string",
      label: "Employment Type",
      description: "One of: `Full-time`, `Part-time`.",
    },
    workHoursPerWeek: {
      type: "integer",
      label: "Work Hours Per Week",
      description: "Number of hours the employee works per week (e.g., `40`).",
    },
    workVisa: {
      type: "boolean",
      label: "Work Visa Required",
      description: "Whether the employee requires a work visa.",
    },
    teamId: {
      type: "string",
      label: "Team ID",
      description: "The ID of the client team. Retrieve from your Deel organization settings.",
    },
    legalEntityId: {
      type: "string",
      label: "Legal Entity ID",
      description: "The ID of the client legal entity. Retrieve from your Deel organization settings.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getEorBenefits($, {
      country_code: this.countryCode,
      employment_type: this.employmentType,
      work_hours_per_week: this.workHoursPerWeek,
      work_visa: this.workVisa,
      team_id: this.teamId,
      legal_entity_id: this.legalEntityId,
    });

    const benefits = response?.data ?? response ?? [];
    const count = Array.isArray(benefits)
      ? benefits.length
      : 0;
    $.export("$summary", `Retrieved ${count} EOR benefits in ${this.countryCode}`);
    return response;
  },
};
