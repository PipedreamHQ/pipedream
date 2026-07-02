import app from "../../deel.app.mjs";

export default {
  key: "deel-create-ic-contract",
  name: "Create IC Contract",
  description:
    "Create a new independent contractor (IC) contract in Deel. Use this to hire a contractor with"
    + " a fixed rate, pay-as-you-go, or milestone-based arrangement."
    + " `type` must be one of: `ongoing_time_based` (recurring fixed rate), `payg_tasks` (per-task),"
    + " `payg_milestones` (milestones), `pay_as_you_go_time_based` (hourly/daily pay-as-you-go)."
    + " `compensationScale` must be one of: `hourly`, `daily`, `weekly`, `monthly`, `biweekly`, `semimonthly`, `custom`."
    + " `compensationFrequency` must be one of: `weekly`, `biweekly`, `semimonthly`, `monthly`."
    + " `clientTeamId` and `clientLegalEntityId` are required — ask the user to provide these from"
    + " their Deel organization settings."
    + " [See the documentation](https://developer.deel.com/api/reference/endpoints/contracts/create-ic-contract)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    title: {
      type: "string",
      label: "Contract Title",
      description: "A descriptive title for this contract (e.g., `Strategy Consulting`).",
    },
    type: {
      type: "string",
      label: "Contract Type",
      description: "Contract type. One of: `ongoing_time_based`, `payg_tasks`, `payg_milestones`, `pay_as_you_go_time_based`.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Contract start date in ISO 8601 format (e.g., `2026-09-01`).",
    },
    clientTeamId: {
      propDefinition: [
        app,
        "clientTeamId",
      ],
    },
    clientLegalEntityId: {
      propDefinition: [
        app,
        "clientLegalEntityId",
      ],
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The contractor's job title (e.g., `Software Engineer`, `Marketing Consultant`).",
    },
    compensationAmount: {
      type: "string",
      label: "Compensation Amount",
      description: "The compensation amount (e.g., `4000`). Not required for `payg_tasks` contracts.",
      optional: true,
    },
    compensationCurrencyCode: {
      type: "string",
      label: "Compensation Currency Code",
      description: "ISO 4217 currency code (e.g., `USD`, `EUR`, `GBP`).",
    },
    compensationScale: {
      type: "string",
      label: "Compensation Scale",
      description: "How the rate is measured. One of: `hourly`, `daily`, `weekly`, `monthly`, `biweekly`, `semimonthly`, `custom`. Not required for task-based contracts.",
      optional: true,
    },
    compensationFrequency: {
      type: "string",
      label: "Compensation Frequency",
      description: "How often the contractor is paid. One of: `weekly`, `biweekly`, `semimonthly`, `monthly`.",
    },
    cycleEnd: {
      type: "integer",
      label: "Cycle End Day",
      description: "Day of month the pay cycle ends (e.g., `28`). Required by Deel.",
    },
    cycleEndType: {
      type: "string",
      label: "Cycle End Type",
      description: "How cycle end is calculated. Use `DAY_OF_MONTH`.",
    },
    paymentDueDays: {
      type: "integer",
      label: "Payment Due Days",
      description: "Number of days after cycle end that payment is due (e.g., `5`).",
    },
    paymentDueType: {
      type: "string",
      label: "Payment Due Type",
      description: "How payment due date is calculated. Use `AFTER_MONTH`.",
    },
    workerFirstName: {
      type: "string",
      label: "Worker First Name",
      description: "The contractor's first name.",
    },
    workerLastName: {
      type: "string",
      label: "Worker Last Name",
      description: "The contractor's last name.",
    },
    workerEmail: {
      type: "string",
      label: "Worker Email",
      description: "The contractor's email address.",
    },
    scopeOfWork: {
      type: "string",
      label: "Scope of Work",
      description: "Description of the work to be performed.",
      optional: true,
    },
    documentsRequired: {
      type: "boolean",
      label: "Documents Required",
      description: "Whether additional documents are required before contract activation. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const compensationDetails = {
      currency_code: this.compensationCurrencyCode,
      frequency: this.compensationFrequency,
      cycle_end: this.cycleEnd,
      cycle_end_type: this.cycleEndType,
      payment_due_days: this.paymentDueDays,
      payment_due_type: this.paymentDueType,
    };
    if (this.compensationAmount) {
      compensationDetails.amount = parseFloat(this.compensationAmount);
    }
    if (this.compensationScale) compensationDetails.scale = this.compensationScale;

    const payload = {
      type: this.type,
      meta: {
        documents_required: this.documentsRequired ?? false,
      },
      title: this.title,
      start_date: this.startDate,
      job_title: {
        name: this.jobTitle,
      },
      client: {
        team: {
          id: this.clientTeamId,
        },
        legal_entity: {
          id: this.clientLegalEntityId,
        },
      },
      compensation_details: compensationDetails,
      worker: {
        first_name: this.workerFirstName,
        last_name: this.workerLastName,
        expected_email: this.workerEmail,
      },
    };
    if (this.scopeOfWork) payload.scope_of_work = this.scopeOfWork;

    const response = await this.app.createIcContract($, payload);

    const contract = response?.data ?? response;
    const contractId = contract?.id ?? "unknown";
    $.export("$summary", `Created IC contract ${contractId}: ${this.title}`);
    return response;
  },
};
