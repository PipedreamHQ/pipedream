import vivocalendar from "../../vivocalendar.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "vivocalendar-cancel-appointment",
  name: "Cancel Appointment",
  description: "Cancels an existing appointment in VIVO Calendar. [See the documentation](https://app.vivocalendar.com/api-docs/index.html)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    vivocalendar,
    appointmentId: {
      propDefinition: [
        vivocalendar,
        "appointmentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.vivocalendar.cancelAppointment({
      appointmentId: this.appointmentId,
    });

    $.export("$summary", `Successfully cancelled appointment with ID: ${this.appointmentId}`);
    return response;
  },
};
