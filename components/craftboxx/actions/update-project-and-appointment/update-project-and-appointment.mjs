import craftboxx from "../../craftboxx.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "craftboxx-update-project-and-appointment",
  name: "Update Project and Appointment",
  description: "Applies updates to a project and its corresponding appointment in Craftboxx. [See the documentation](https://api.craftboxx.de/docs/docs.json)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    craftboxx,
    projectNumber: {
      propDefinition: [
        craftboxx,
        "projectNumber",
      ],
    },
    newProjectDetails: {
      propDefinition: [
        craftboxx,
        "newProjectDetails",
      ],
    },
    appointmentNumber: {
      propDefinition: [
        craftboxx,
        "appointmentNumber",
      ],
    },
    newAppointmentDetails: {
      propDefinition: [
        craftboxx,
        "newAppointmentDetails",
      ],
    },
    optionalNotes: {
      propDefinition: [
        craftboxx,
        "optionalNotes",
        (c) => ({
          optional: c.optionalNotes,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const updateProjectResponse = await this.craftboxx.updateProject({
      projectNumber: this.projectNumber,
      newProjectDetails: this.newProjectDetails,
    });

    const updateAppointmentResponse = await this.craftboxx.updateAppointment({
      appointmentNumber: this.appointmentNumber,
      newAppointmentDetails: this.newAppointmentDetails,
      notes: this.optionalNotes,
    });

    $.export("$summary", `Updated project ${this.projectNumber} and appointment ${this.appointmentNumber}`);
    return {
      updateProjectResponse,
      updateAppointmentResponse,
    };
  },
};
