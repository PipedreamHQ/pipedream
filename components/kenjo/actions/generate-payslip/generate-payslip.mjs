import kenjo from "../../kenjo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kenjo-generate-payslip",
  name: "Generate Payslip",
  description: "Generates a payslip for a specific employee. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kenjo,
    generatePayslipEmployeeId: {
      propDefinition: [
        kenjo,
        "generatePayslipEmployeeId",
      ],
    },
    generatePayPeriodStart: {
      propDefinition: [
        kenjo,
        "generatePayPeriodStart",
      ],
    },
    generatePayPeriodEnd: {
      propDefinition: [
        kenjo,
        "generatePayPeriodEnd",
      ],
    },
    generateCustomNotes: {
      propDefinition: [
        kenjo,
        "generateCustomNotes",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kenjo.generatePayslip();
    $.export(
      "$summary",
      `Generated payslip for employee ${this.generatePayslipEmployeeId} for period ${this.generatePayPeriodStart} to ${this.generatePayPeriodEnd}`,
    );
    return response;
  },
};
