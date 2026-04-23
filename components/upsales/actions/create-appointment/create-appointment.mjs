import app from "../../upsales.app.mjs";

export default {
  key: "upsales-create-appointment",
  name: "Create Appointment",
  description: "Creates a new appointment in Upsales. [See the documentation](https://api.upsales.com/#b7fd1fe3-e88d-4f3c-8323-100e755ad3e2)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    clientId: {
      type: "integer",
      label: "Client ID",
      description: "The client ID to associate with the appointment",
    },
    users: {
      propDefinition: [
        app,
        "userId",
      ],
      type: "string[]",
      label: "Users",
      description: "User IDs to associate with the appointment",
      optional: true,
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the appointment. In ISO 8601 format. e.g. `2026-04-16`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the appointment. In ISO 8601 format. e.g. `11:00:00`",
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
    const response = await this.app.createAppointment({
      $,
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
        activityType: {
          id: this.activityType,
        },
        contacts: this.contactIds
          ? this.contactIds.map((contact) => ({
            id: contact,
          }))
          : undefined,
      },
    });
    $.export("$summary", `Successfully created appointment with ID: ${response.data.id}`);
    return response;
  },
};
