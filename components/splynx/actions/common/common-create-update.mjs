import splynx from "../../splynx.app.mjs";

export default {
  props: {
    splynx,
    name: {
      type: "string",
      label: "Name",
      description: "The full name of the customer",
    },
    partnerId: {
      type: "integer",
      label: "Partner ID",
      description:
        "Partner id. You can get it at page \"Administration / Partners\"",
    },
    locationId: {
      type: "integer",
      label: "Location ID",
      description:
        "Location id. You can get it at page \"Administration / Locations\"",
    },
    category: {
      type: "string",
      label: "Category",
      description: "Category of the customer",
      options: [
        {
          label: "Private person",
          value: "person",
        },
        {
          label: "Company",
          value: "company",
        },
      ],
    },
    login: {
      type: "string",
      label: "Login",
      description: "The login of the user",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the customer",
      optional: true,
      options: [
        "new",
        "active",
        "blocked",
        "disabled",
      ],
      default: "new",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the customer",
      optional: true,
    },
    billingEmail: {
      type: "string",
      label: "Billing Email",
      description: "The billing email of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the customer, e.g. `555-0134`",
      optional: true,
    },
    street: {
      type: "string",
      label: "Street",
      description: "The street of the customer",
      optional: true,
    },
    zipCode: {
      type: "string",
      label: "Zip Code",
      description: "The zip code of the customer",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the customer",
      optional: true,
    },
    dateAdd: {
      type: "string",
      label: "Date Added",
      description: "The date the customer was added (defaults to current date)",
      optional: true,
    },
  },
  methods: {
    getData() {
      const { // eslint-disable-next-line no-unused-vars
        splynx,
        partnerId,
        locationId,
        billingEmail,
        street,
        zipCode,
        dateAdd,
        ...data
      } = this;

      return {
        ...data,
        partner_id: partnerId,
        location_id: locationId,
        billing_email: billingEmail,
        street_1: street,
        zip_code: zipCode,
        date_add: dateAdd,
      };
    },
  },
};
