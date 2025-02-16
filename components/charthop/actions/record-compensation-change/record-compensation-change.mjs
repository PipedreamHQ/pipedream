import charthop from "../../charthop.app.mjs";

export default {
  key: "charthop-record-compensation-change",
  name: "Record Compensation Change",
  description: "Logs or modifies an employee's compensation records, such as salary increases, bonuses, or equity grants. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    charthop,
    employeeId: {
      propDefinition: [
        charthop,
        "modifyCompensationEmployeeId",
      ],
    },
    compensationDetails: {
      propDefinition: [
        charthop,
        "modifyCompensationDetails",
      ],
    },
    effectiveDate: {
      propDefinition: [
        charthop,
        "modifyCompensationEffectiveDate",
      ],
      optional: true,
    },
    reason: {
      propDefinition: [
        charthop,
        "modifyCompensationReason",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.charthop.modifyCompensation();
    const summaryParts = [
      `Compensation for employee ID ${this.employeeId} has been updated`,
    ];
    if (this.reason) {
      summaryParts.push(`for reason: ${this.reason}`);
    }
    $.export("$summary", summaryParts.join(" ") + ".");
    return response;
  },
};
