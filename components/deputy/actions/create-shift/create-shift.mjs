import deputy from "../../deputy.app.mjs";

export default {
  key: "deputy-create-shift",
  name: "Create Shift",
  description: "Starts a new work shift for a specified employee in the Deputy app.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deputy,
    employeeIdentifier: {
      propDefinition: [
        deputy,
        "employeeIdentifier",
      ],
    },
    startTime: {
      propDefinition: [
        deputy,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        deputy,
        "endTime",
      ],
    },
    breakDetails: {
      propDefinition: [
        deputy,
        "breakDetails",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const body = {
      Employee: this.employeeIdentifier,
      Start: this.startTime,
      End: this.endTime,
    };

    if (this.breakDetails) {
      body.Break = this.breakDetails;
    }

    const response = await this.deputy.startNewWorkShift({
      data: body,
    });

    $.export("$summary", `Successfully started work shift for employee ${this.employeeIdentifier}`);
    return response;
  },
};
