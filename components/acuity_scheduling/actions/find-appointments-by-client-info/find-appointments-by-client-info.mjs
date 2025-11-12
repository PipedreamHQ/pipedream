import acuityScheduling from "../../acuity_scheduling.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "acuity_scheduling-find-appointments-by-client-info",
  name: "Find Appointments by Client Info",
  description: "Retrieves existing appointments using the client's information, allowing you to track all the appointments associated with a specific client. [See the documentation](https://developers.acuityscheduling.com/reference/get-appointments)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    acuityScheduling,
    calendarID: {
      propDefinition: [
        acuityScheduling,
        "calendarId",
      ],
      optional: true,
    },
    appointmentTypeID: {
      propDefinition: [
        acuityScheduling,
        "appointmentTypeId",
      ],
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Filter appointments for client first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Filter appointments for client last name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter appointments for client email address.",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Filter appointments for client phone.",
      optional: true,
    },
    customFields: {
      type: "object",
      label: "Custom Field",
      description: "Filter appointments matching a particular custom intake form field **eg. ?field:1234=Hello**",
      optional: true,
    },
    showAll: {
      type: "boolean",
      label: "Show All",
      description: "To retrieve both canceled and scheduled appointments.",
      optional: true,
    },
  },
  async run({ $ }) {
    let params = {
      calendarID: this.calendarID,
      appointmentTypeID: this.appointmentTypeID,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      showAll: this.showAll,
    };

    if (this.customFields) {
      params = {
        ...params,
        ...parseObject(this.customFields),
      };
    }
    const appointments = await this.acuityScheduling.listAppointments({
      $,
      params,
    });

    $.export("$summary", `Found ${appointments.length} appointments for the search!`);
    return appointments;
  },
};
