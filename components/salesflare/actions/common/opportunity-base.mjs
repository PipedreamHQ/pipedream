import app from "../../salesflare.app.mjs";

export default {
  props: {
    app,
    startDate: {
      type: "string",
      label: "Start Date",
      description: "Start date. Must be in ISO format. e.g. `2019-08-24T14:15:22Z`",
      optional: true,
    },
    probability: {
      type: "string",
      label: "Probability",
      description: "Probability of the opportunity. Min `0`",
      optional: true,
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
      description: "Name of the opportunity",
    },
    value: {
      type: "integer",
      label: "Value",
      description: "Value of the opportunity. Min `0`",
      optional: true,
    },
    closeDate: {
      type: "string",
      label: "Close Date",
      description: "Close date of the opportunity. Must be in ISO format. e.g. `2019-08-24T14:15:22Z`",
      optional: true,
    },
    closed: {
      type: "boolean",
      label: "Closed",
      description: "Is closed",
      optional: true,
    },
    tags: {
      propDefinition: [
        app,
        "tags",
      ],
    },
    recurringPricePerUnit: {
      type: "integer",
      label: "Recurring Price Per Unit",
      description: "Recurring price per unit",
      optional: true,
    },
    frequency: {
      type: "string",
      label: "Frequency",
      description: "Opportunity frequency",
      optional: true,
      options: [
        "annually",
        "weekly",
        "monthly",
        "daily",
      ],
    },
    contractStartDate: {
      type: "string",
      label: "Contract Start Date",
      description: "Contract start date. Must be in ISO format. e.g. `2019-08-24T14:15:22Z`",
      optional: true,
    },
    contractEndDate: {
      type: "string",
      label: "Contract End Date",
      description: "Contract end date. Must be in ISO format. e.g. `2019-08-24T14:15:22Z`",
      optional: true,
    },
    custom: {
      propDefinition: [
        app,
        "custom",
      ],
    },
  },
};
