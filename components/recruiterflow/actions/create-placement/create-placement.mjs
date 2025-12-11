import app from "../../recruiterflow.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "recruiterflow-create-placement",
  name: "Create Placement",
  description: "Records a successful candidate placement in Recruiterflow. [See the documentation](https://recruiterflow.com/swagger.yml)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "User ID",
      description: "The ID of the user creating the placement",
    },
    candidateId: {
      propDefinition: [
        app,
        "candidateId",
      ],
      label: "Candidate ID",
      description: "The ID of the candidate being placed",
    },
    jobId: {
      propDefinition: [
        app,
        "jobId",
      ],
      label: "Job ID",
      description: "The ID of the job for this placement",
    },
    jobStartDate: {
      type: "string",
      label: "Job Start Date",
      description: "The start date of the job (`YYYY-MM-DD` format, e.g., `2021-01-12`)",
    },
    contractStartDate: {
      type: "string",
      label: "Contract Start Date",
      description: "The contract start date (`YYYY-MM-DD` format, e.g., `2021-01-12`)",
      optional: true,
    },
    contractEndDate: {
      type: "string",
      label: "Contract End Date",
      description: "The contract end date (`YYYY-MM-DD` format, e.g., `2021-01-12`)",
      optional: true,
    },
    billingDate: {
      type: "string",
      label: "Billing Date",
      description: "The billing date (`YYYY-MM-DD` format, e.g., `2021-01-12`)",
      optional: true,
    },
    salaryAmount: {
      type: "integer",
      label: "Salary Amount",
      description: "The salary amount",
      optional: true,
    },
    salaryCurrency: {
      type: "string",
      label: "Salary Currency",
      description: "The currency for the salary (e.g., `USD`, `EUR`, `GBP`)",
      optional: true,
    },
    revenueAmount: {
      type: "integer",
      label: "Revenue Amount",
      description: "The placement revenue/fee amount",
      optional: true,
    },
    revenueCurrency: {
      type: "string",
      label: "Revenue Currency",
      description: "The currency for the revenue (e.g., `USD`, `EUR`, `GBP`)",
      optional: true,
    },
    successFeeAmount: {
      type: "integer",
      label: "Success Fee Amount",
      description: "The success fee amount",
      optional: true,
    },
    successFeeCurrency: {
      type: "string",
      label: "Success Fee Currency",
      description: "The currency for the success fee",
      optional: true,
    },
    bonusAmount: {
      type: "integer",
      label: "Bonus Amount",
      description: "The bonus amount",
      optional: true,
    },
    bonusCurrency: {
      type: "string",
      label: "Bonus Currency",
      description: "The currency for the bonus",
      optional: true,
    },
    payRateAmount: {
      type: "integer",
      label: "Pay Rate Amount",
      description: "The pay rate amount",
      optional: true,
    },
    payRateCurrency: {
      type: "string",
      label: "Pay Rate Currency",
      description: "The currency for the pay rate",
      optional: true,
    },
    payRateFrequency: {
      type: "string",
      label: "Pay Rate Frequency",
      description: "The frequency of the pay rate (e.g., `Hourly`, `Daily`, `Weekly`, `Monthly`, `Yearly`)",
      optional: true,
    },
    billRateAmount: {
      type: "integer",
      label: "Bill Rate Amount",
      description: "The bill rate amount",
      optional: true,
    },
    billRateCurrency: {
      type: "string",
      label: "Bill Rate Currency",
      description: "The currency for the bill rate",
      optional: true,
    },
    billRateFrequency: {
      type: "string",
      label: "Bill Rate Frequency",
      description: "The frequency of the bill rate (e.g., `Hourly`, `Daily`, `Weekly`, `Monthly`, `Yearly`)",
      optional: true,
    },
    isFullTime: {
      type: "boolean",
      label: "Is Full Time",
      description: "Whether this is a full-time placement",
      optional: true,
    },
    workQuantumNumber: {
      type: "integer",
      label: "Work Quantum Number",
      description: "The number of work units (e.g., `40` for 40 hours/week)",
      optional: true,
    },
    workQuantumUnit: {
      type: "string",
      label: "Work Quantum Unit",
      description: "The unit of work (e.g., `Hours`, `Days`)",
      optional: true,
    },
    workQuantumFrequency: {
      type: "string",
      label: "Work Quantum Frequency",
      description: "The frequency of work quantum (e.g., `Weekly`, `Monthly`)",
      optional: true,
    },
    contactIds: {
      type: "integer[]",
      label: "Contact IDs",
      description: "Array of contact IDs associated with this placement",
      optional: true,
    },
    noteId: {
      type: "integer",
      label: "Note ID",
      description: "The ID of a note to associate with this placement",
      optional: true,
    },
    revenueSplit: {
      type: "string[]",
      label: "Revenue Split",
      description: "Array of revenue split objects as JSON strings. Format: `[{\"user\": {\"id\": 1}, \"revenue\": {\"number\": 5000, \"pct\": 50}}]`",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of custom field objects as JSON strings. Format: `[{\"id\": 1, \"value\": \"...\"}]`",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: false,
  },
  async run({ $ }) {
    const {
      app,
      userId,
      candidateId,
      jobId,
      jobStartDate,
      contractStartDate,
      contractEndDate,
      billingDate,
      salaryAmount,
      salaryCurrency,
      revenueAmount,
      revenueCurrency,
      successFeeAmount,
      successFeeCurrency,
      bonusAmount,
      bonusCurrency,
      payRateAmount,
      payRateCurrency,
      payRateFrequency,
      billRateAmount,
      billRateCurrency,
      billRateFrequency,
      isFullTime,
      workQuantumNumber,
      workQuantumUnit,
      workQuantumFrequency,
      contactIds,
      noteId,
      revenueSplit,
      customFields,
    } = this;

    const placement = {
      prospect: {
        id: candidateId,
      },
      job: {
        id: jobId,
      },
      job_start_date: jobStartDate,
    };

    // Add optional date fields
    if (contractStartDate) placement.contract_start_date = contractStartDate;
    if (contractEndDate) placement.contract_end_date = contractEndDate;
    if (billingDate) placement.billing_date = billingDate;

    // Add salary
    if (salaryAmount && salaryCurrency) {
      placement.salary = {
        number: salaryAmount,
        currency: salaryCurrency,
      };
    }

    // Add revenue
    if (revenueAmount && revenueCurrency) {
      placement.revenue = {
        number: revenueAmount,
        currency: revenueCurrency,
      };
    }

    // Add success fee
    if (successFeeAmount && successFeeCurrency) {
      placement.success_fee = {
        number: successFeeAmount,
        currency: successFeeCurrency,
      };
    }

    // Add bonus
    if (bonusAmount && bonusCurrency) {
      placement.bonus = {
        number: bonusAmount,
        currency: bonusCurrency,
      };
    }

    // Add pay rate
    if (payRateAmount && payRateCurrency) {
      placement.pay_rate = {
        number: payRateAmount,
        currency: payRateCurrency,
      };
      if (payRateFrequency) {
        placement.pay_rate.frequency = {
          name: payRateFrequency,
        };
      }
    }

    // Add bill rate
    if (billRateAmount && billRateCurrency) {
      placement.bill_rate = {
        number: billRateAmount,
        currency: billRateCurrency,
      };
      if (billRateFrequency) {
        placement.bill_rate.frequency = {
          name: billRateFrequency,
        };
      }
    }

    // Add work quantum
    if (isFullTime !== undefined || workQuantumNumber || workQuantumUnit || workQuantumFrequency) {
      placement.work_quantum = {};
      if (isFullTime !== undefined) placement.work_quantum.is_full_time = isFullTime;
      if (workQuantumNumber) placement.work_quantum.number = workQuantumNumber;
      if (workQuantumUnit) {
        placement.work_quantum.unit = {
          name: workQuantumUnit,
        };
      }
      if (workQuantumFrequency) {
        placement.work_quantum.frequency = {
          name: workQuantumFrequency,
        };
      }
    }

    // Add contacts
    if (contactIds && contactIds.length > 0) {
      placement.contacts = contactIds.map((id) => ({
        id,
      }));
    }

    // Add note
    if (noteId) placement.note = noteId;

    // Add revenue split
    if (revenueSplit && revenueSplit.length > 0) {
      placement.revenue_split = utils.parseJson(revenueSplit);
    }

    // Add custom fields
    if (customFields && customFields.length > 0) {
      placement.custom_fields = utils.parseJson(customFields);
    }

    const data = {
      user_id: userId,
      placements: [
        placement,
      ],
    };

    const response = await app.createPlacement({
      $,
      data,
    });

    $.export("$summary", "Successfully created placement record");
    return response;
  },
};
