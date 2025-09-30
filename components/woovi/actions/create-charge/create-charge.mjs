import woovi from "../../woovi.app.mjs";

export default {
  key: "woovi-create-charge",
  name: "Create Charge",
  description: "Generates a charge for a customer. [See the documentation](https://developers.woovi.com/en/api#tag/charge/paths/~1api~1v1~1charge/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    woovi,
    correlationId: {
      type: "string",
      label: "Correlation ID",
      description: "Your correlation ID to keep track of this charge",
    },
    value: {
      type: "integer",
      label: "Value",
      description: "Value in cents for this charge",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Charge type is used to determine whether a charge will have a deadline, fines and interests",
      options: [
        "DYNAMIC",
        "OVERDUE",
      ],
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment to be added",
      optional: true,
    },
    identifier: {
      type: "string",
      label: "Identifier",
      description: "Custom identifier for EMV",
      optional: true,
    },
    customer: {
      propDefinition: [
        woovi,
        "customer",
      ],
    },
    daysForDueDate: {
      type: "integer",
      label: "Days For Due Date",
      description: "Time in days until the charge hits the deadline so fines and interests start applying. This property is only considered for charges of type OVERDUE",
      optional: true,
    },
    daysAfterDueDate: {
      type: "integer",
      label: "Days After Due Date",
      description: "Time in days that a charge is still payable after the deadline. This property is only considered for charges of type OVERDUE",
      optional: true,
    },
    interests: {
      type: "integer",
      label: "Interests",
      description: "Value in basis points of interests to be applied daily after the charge hits the deadline. This property is only considered for charges of type OVERDUE",
      optional: true,
    },
    fines: {
      type: "integer",
      label: "Fines",
      description: "Value in basis points of fines to be applied when the charge hits the deadline. This property is only considered for charges of type OVERDUE",
      optional: true,
    },
    enableCashbackPercentage: {
      type: "boolean",
      label: "Enable Cashback Percentage",
      description: "Set to `true` to enable cashback and `false` to disable.",
      optional: true,
    },
    enableCashbackExclusivePercentage: {
      type: "boolean",
      label: "Enable Cashback Exclusive Percentage",
      description: "Set to `true` to enable fidelity cashback and `false` to disable.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.woovi.createCharge({
      data: {
        correlationID: this.correlationId,
        value: this.value,
        type: this.type,
        comment: this.comment,
        identifier: this.identifier,
        customer: this.customer
          ? {
            name: this.customer.label,
            taxID: this.customer.value,
          }
          : undefined,
        daysForDueDate: this.daysForDueDate,
        daysAfterDueDate: this.daysAfterDueDate,
        interests: this.interests
          ? {
            value: this.interests,
          }
          : undefined,
        fines: this.fines
          ? {
            value: this.fines,
          }
          : undefined,
        enableCashbackPercentage: this.enableCashbackPercentage,
        enableCashbackExclusivePercentage: this.enableCashbackExclusivePercentage,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created charge with ID ${this.correlationId}.`);
    }

    return response;
  },
};
