import app from "../../evenium.app.mjs";

export default {
  type: "action",
  key: "evenium-create-event",
  version: "0.0.1",
  name: "Create Event",
  description: "Creates a new event. [See the documentation](https://static.evenium.com/api-docs/organizer/index-json.html#_create_events)",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "The title of the event",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the event in RFC 3339 format (e.g., 2010-07-10T07:00:00.000Z)",
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The end date of the event in RFC 3339 format (e.g., 2010-07-12T17:00:00.000Z)",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the event",
      optional: true,
    },
    addressName: {
      type: "string",
      label: "Address Name",
      description: "The name of the address",
      optional: true,
    },
    addressStreet: {
      type: "string",
      label: "Address Street",
      description: "The street of the address",
      optional: true,
    },
    addressCity: {
      type: "string",
      label: "Address City",
      description: "The city of the address",
      optional: true,
    },
    addressCountryCode: {
      type: "string",
      label: "Address Country Code",
      description: "The country code of the address",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.createEvent({
      $,
      data: {
        title: this.title,
        startDate: this.startDate,
        endDate: this.endDate,
        description: this.description,
        location: {
          name: this.addressName,
          street: this.addressStreet,
          city: this.addressCity,
          countryCode: this.addressCountryCode,
        },
      },
    });

    $.export("$summary", `Successfully created event with ID: ${response.id}`);

    return response;
  },
};

