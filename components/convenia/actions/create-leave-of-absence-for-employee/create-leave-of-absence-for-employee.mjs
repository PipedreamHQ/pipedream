import convenia from "../../convenia.app.mjs";

export default {
  key: "convenia-create-leave-of-absence-for-employee",
  name: "Create Leave Of Absence For Employee",
  description: "Creates a new leave of absence for an employee. [See the documentation](https://docs--api-convenia-com-br.translate.goog/?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    convenia,
    employeeId: {
      propDefinition: [
        convenia,
        "employeeId",
      ],
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the leave of absence (format: YYYY-MM-DD).",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the leave of absence (format: YYYY-MM-DD).",
    },
    justification: {
      type: "string",
      label: "Justification",
      description: "Justification of Absence.",
      optional: true,
    },
    absenceMotiveId: {
      propDefinition: [
        convenia,
        "absenceMotiveId",
      ],
    },
    absenceTypeId: {
      propDefinition: [
        convenia,
        "absenceTypeId",
      ],
    },
    cid: {
      type: "integer",
      label: "CID",
      description: "Registration.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.convenia.createLeaveOfAbsence({
      employeeId: this.employeeId,
      data: {
        date_from: this.startDate,
        date_to: this.endDate,
        absence_type_id: this.absenceTypeId,
        absence_motive_id: this.absenceMotiveId,
        justification: this.justification,
        cid: this.cid,
      },
    });
    $.export("$summary", `Successfully created leave of absence for employee with ID: ${this.employeeId}`);
    return response;
  },
};
