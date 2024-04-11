import acuityScheduling from "../../acuity_scheduling.app.mjs";

export default {
  key: "acuity_scheduling-find-appointments-by-client-info",
  name: "Find Appointments by Client Info",
  description: "Retrieves existing appointments using the client's information, allowing you to track all the appointments associated with a specific client. [See the documentation]()", // Placeholder for documentation link
  version: "0.0.1",
  type: "action",
  props: {
    acuityScheduling,
    clientNameOrEmail: {
      propDefinition: [
        acuityScheduling,
        "clientNameOrEmail",
      ],
    },
  },
  async run({ $ }) {
    const appointments = await this.acuityScheduling.getAppointments({
      clientNameOrEmail: this.clientNameOrEmail,
    });

    $.export("$summary", `Found ${appointments.length} appointments for client ${this.clientNameOrEmail}`);
    return appointments;
  },
};
