import convenia from "../../convenia.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "convenia-create-leave-of-absence-for-employee",
  name: "Create Leave Of Absence For Employee",
  description: "Creates a new leave of absence for an employee. [See the documentation](https://docs--api-convenia-com-br.translate.goog/?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp)",
  version: "0.0.{{ts}}",
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
    absenceTypeId: {
      type: "integer",
      label: "Absence Type ID",
      description: "The ID of the absence type.",
    },
    absenceMotiveId: {
      type: "integer",
      label: "Absence Motive ID",
      description: "The ID of the absence motive.",
    },
  },
  async run({ $ }) {
    const absenceData = {
      startDate: this.startDate,
      endDate: this.endDate,
      absenceTypeId: this.absenceTypeId,
      absenceMotiveId: this.absenceMotiveId,
    };

    const response = await this.convenia.createLeaveOfAbsence(this.employeeId, absenceData);
    $.export("$summary", `Successfully created leave of absence for employee ${this.employeeId}`);
    return response;
  },
};
