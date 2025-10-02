import app from "../../zoho_bookings.app.mjs";

export default {
  key: "zoho_bookings-fetch-availability",
  name: "Fetch Availability",
  description: "Fetch availability of appointments across services. [See the documentation](https://www.zoho.com/bookings/help/api/v1/fetch-availability.html)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    serviceId: {
      propDefinition: [
        app,
        "serviceId",
      ],
      description: "The unique id of the service for which availability is to be fetched.",
    },
    staffId: {
      propDefinition: [
        app,
        "staffId",
      ],
      optional: false,
      description: "The unique id of the staff associated with the service for which availability is to be fetched.",
    },
    resourceId: {
      propDefinition: [
        app,
        "resourceId",
      ],
      description: "The unique id of the resource associated with the service for which availability is to be fetched.",
    },
    selectedDate: {
      type: "string",
      label: "Selected Date",
      description: "The date on which services are checked for availability. format: `dd-MMM-yyyy` (e.g. 30-Apr-2019)",
    },
  },
  async run({ $ }) {
    const { response } = await this.app.fetchAvailability({
      $,
      params: {
        service_id: this.serviceId,
        staff_id: this.staffId,
        resource_id: this.resourceId,
        selected_date: this.selectedDate,
      },
    });

    if (response?.returnvalue?.status === "failure") {
      throw new Error(response?.returnvalue?.message);
    }
    $.export("$summary", "Successfully fetched availability");
    return response;
  },
};
