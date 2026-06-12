import app from "../../mindbody.app.mjs";

export default {
  key: "mindbody-book-appointment",
  name: "Book Appointment",
  description:
    "Books a client into a one-on-one service appointment (personal training, massage, etc.)."
    + " All five core parameters are required: `clientId`, `locationId`, `sessionTypeId`, `startDateTime`, and `staffId`."
    + " Use **Search Clients** to find the client ID, **List Session Types** to find `sessionTypeId`, and **List Staff** to find `staffId`."
    + " `startDateTime` format: ISO 8601 `YYYY-MM-DDTHH:MM:SS` (e.g., `2026-07-15T10:00:00`)."
    + " Location IDs are returned by **Get Site Info**."
    + " [See the documentation](https://developers.mindbodyonline.com/ui/documentation/public-api#/http/api-endpoints/appointment/add-appointment)",
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
      propDefinition: [
        app,
        "clientId",
      ],
      description: "The client to book the appointment for. Use **Search Clients** to find the ID.",
    },
    locationId: {
      type: "integer",
      label: "Location ID",
      description: "The studio location where the appointment will take place. Location IDs are returned by **Get Site Info**.",
    },
    sessionTypeId: {
      type: "integer",
      label: "Session Type ID",
      description: "The type of service to book (e.g., personal training, massage). Use **List Session Types** to find valid IDs.",
    },
    startDateTime: {
      type: "string",
      label: "Start Date/Time",
      description: "When the appointment starts. ISO 8601 format: `YYYY-MM-DDTHH:MM:SS` (e.g., `2026-07-15T10:00:00`).",
    },
    staffId: {
      type: "string",
      label: "Staff ID",
      description: "The staff member (instructor/therapist) who will deliver the service. Use **List Staff** to find IDs.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Optional notes to attach to the appointment.",
      optional: true,
    },
  },
  async run({ $ }) {
    const body = {
      ClientId: this.clientId,
      LocationId: this.locationId,
      SessionTypeId: this.sessionTypeId,
      StartDateTime: this.startDateTime,
      StaffId: this.staffId,
      Notes: this.notes,
    };

    const response = await this.app.addAppointment({
      $,
      data: body,
    });
    const appt = response.Appointment || {};
    $.export("$summary", `Booked appointment ${appt.Id} for client ${this.clientId} on ${this.startDateTime}`);
    return response;
  },
};
