import app from "../../upsales.app.mjs";

export default {
  key: "upsales-update-appointment",
  name: "Update Appointment",
  description: "Updates an existing appointment in Upsales. [See the documentation](https://api.upsales.com/#79919ae8-cef0-40cd-a505-22a5a7ad0611)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    appointmentId: {
      type: "string",
      label: "Appointment ID",
      description: "The ID of the appointment to update",
      async options({ page }) {
        const { data } = await this.app.listAppointments({
          params: {
            limit: 100,
            offset: 100 * page,
          },
        });
        return data?.map((appointment) => ({
          label: appointment.description || `Appointment ${appointment.id}`,
          value: appointment.id,
        })) || [];
      },
    },
    clientId: {
      type: "integer",
      label: "Client ID",
      description: "The client ID to associate with the appointment",
      optional: true,
    },
    users: {
      propDefinition: [
        app,
        "userId",
      ],
      type: "string[]",
      label: "Users",
      description: "Select one or more users to associate with the appointment",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the appointment. In ISO 8601 format. e.g. `2026-04-16`",
      optional: true,
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the appointment. In ISO 8601 format. e.g. `11:00:00`",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the appointment",
      optional: true,
    },
    activityType: {
      propDefinition: [
        app,
        "activityTypeId",
      ],
      optional: true,
    },
    contactIds: {
      propDefinition: [
        app,
        "contactId",
      ],
      type: "string[]",
      label: "Contact IDs",
      description: "The contact IDs to associate with the appointment",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.updateAppointment({
      $,
      appointmentId: this.appointmentId,
      data: {
        client: this.clientId,
        users: this.users
          ? this.users.map((user) => ({
            id: user,
          }))
          : undefined,
        date: this.date,
        endTime: this.endTime,
        description: this.description,
        activityType: this.activityType
          ? {
            id: this.activityType,
          }
          : undefined,
        contacts: this.contactIds
          ? this.contactIds.map((contact) => ({
            id: contact,
          }))
          : undefined,
      },
    });
    $.export("$summary", `Successfully updated appointment with ID: ${this.appointmentId}`);
    return response;
  },
};
