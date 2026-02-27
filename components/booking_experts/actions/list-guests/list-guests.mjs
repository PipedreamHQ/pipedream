import bookingExperts from "../../booking_experts.app.mjs";

export default {
  key: "booking_experts-list-guests",
  name: "List Guests",
  description: "List all guests for a reservation. [See the documentation](https://developers.bookingexperts.com/reference/administration-reservation-guests-index)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bookingExperts,
    administrationId: {
      propDefinition: [
        bookingExperts,
        "administrationId",
      ],
    },
    reservationId: {
      propDefinition: [
        bookingExperts,
        "reservationId",
        ({ administrationId }) => ({
          administrationId,
        }),
      ],
    },
    info: {
      type: "alert",
      alertType: "warning",
      content: "**The API will only list guests created through the Booking Experts API.**",
    },
    fields: {
      propDefinition: [
        bookingExperts,
        "fields",
      ],
    },
    sort: {
      propDefinition: [
        bookingExperts,
        "sort",
      ],
    },
    page: {
      propDefinition: [
        bookingExperts,
        "page",
      ],
    },
    perPage: {
      propDefinition: [
        bookingExperts,
        "perPage",
      ],
    },
    id: {
      propDefinition: [
        bookingExperts,
        "guestId",
        ({
          administrationId, reservationId,
        }) => ({
          administrationId,
          reservationId,
        }),
      ],
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Filter by first name",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Filter by last name",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "Filter by email",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Filter by phone",
      optional: true,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Filter by gender",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Filter by country code",
      optional: true,
    },
    dateOfBirth: {
      type: "string",
      label: "Date of Birth",
      description: "Filter by date of birth",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Filter by address",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Filter by city",
      optional: true,
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Filter by postal code",
      optional: true,
    },
    province: {
      type: "string",
      label: "Province",
      description: "Filter by province",
      optional: true,
    },
    municipality: {
      type: "string",
      label: "Municipality",
      description: "Filter by municipality",
      optional: true,
    },
    documentType: {
      type: "string",
      label: "Document Type",
      description: "Filter by document type",
      optional: true,
    },
    documentNumber: {
      type: "string",
      label: "Document Number",
      description: "Filter by document number",
      optional: true,
    },
    documentIssueDate: {
      type: "string",
      label: "Document Issue Date",
      description: "Filter by document issue date",
      optional: true,
    },
    visaNumber: {
      type: "string",
      label: "Visa Number",
      description: "Filter by visa number",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.bookingExperts.listGuests({
      $,
      administrationId: this.administrationId,
      reservationId: this.reservationId,
      params: {
        "fields[guest]": this.fields,
        "page[number]": this.page,
        "page[size]": this.perPage,
        "sort": this.sort,
        "filter[id]": this.id,
        "filter[first_name]": this.firstName,
        "filter[last_name]": this.lastName,
        "filter[email]": this.email,
        "filter[phone]": this.phone,
        "filter[gender]": this.gender,
        "filter[country_code]": this.countryCode,
        "filter[date_of_birth]": this.dateOfBirth,
        "filter[address]": this.address,
        "filter[city]": this.city,
        "filter[postal_code]": this.postalCode,
        "filter[province]": this.province,
        "filter[municipality]": this.municipality,
        "filter[document_type]": this.documentType,
        "filter[document_number]": this.documentNumber,
        "filter[document_issue_date]": this.documentIssueDate,
        "filter[visa_number]": this.visaNumber,
      },
    });
    $.export("$summary", `Successfully listed ${response.data.length} guests`);
    return response;
  },
};
