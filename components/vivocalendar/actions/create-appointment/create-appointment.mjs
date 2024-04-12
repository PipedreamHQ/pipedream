import vivocalendar from "../../vivocalendar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vivocalendar-create-appointment",
  name: "Create Appointment",
  description: "Creates a new appointment in VIVO Calendar. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vivocalendar,
    customerId: {
      propDefinition: [
        vivocalendar,
        "customerId",
      ],
    },
    appointmentDate: {
      propDefinition: [
        vivocalendar,
        "appointmentDate",
      ],
    },
    appointmentTime: {
      propDefinition: [
        vivocalendar,
        "appointmentTime",
      ],
    },
    appointmentNotes: {
      propDefinition: [
        vivocalendar,
        "appointmentNotes",
        (c) => ({
          optional: true,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vivocalendar.createAppointment({
      customerId: this.customerId,
      appointmentDate: this.appointmentDate,
      appointmentTime: this.appointmentTime,
      appointmentNotes: this.appointmentNotes,
    });

    $.export("$summary", `Successfully created appointment for customer ID: ${this.customerId}`);
    return response;
  },
};
