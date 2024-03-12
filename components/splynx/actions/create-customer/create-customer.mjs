import splynx from "../../splynx.app.mjs";

export default {
  key: "splynx-create-customer",
  name: "Create Customer",
  description:
    "Creates a new customer with the provided details. [See the documentation](https://splynx.docs.apiary.io/#reference/customers/customers-collection/create-a-customer)",
  version: "0.0.1",
  type: "action",
  props: {
    splynx,
    name: {
      propDefinition: [
        splynx,
        "name",
      ],
    },
    partnerId: {
      propDefinition: [
        splynx,
        "partnerId",
      ],
    },
    locationId: {
      propDefinition: [
        splynx,
        "locationId",
      ],
    },
    category: {
      propDefinition: [
        splynx,
        "category",
      ],
    },
    login: {
      propDefinition: [
        splynx,
        "login",
      ],
    },
    status: {
      propDefinition: [
        splynx,
        "status",
      ],
    },
    email: {
      propDefinition: [
        splynx,
        "email",
      ],
    },
    billingEmail: {
      propDefinition: [
        splynx,
        "billingEmail",
      ],
    },
    phone: {
      propDefinition: [
        splynx,
        "phone",
      ],
    },
    street: {
      propDefinition: [
        splynx,
        "street",
      ],
    },
    zipCode: {
      propDefinition: [
        splynx,
        "zipCode",
      ],
    },
    city: {
      propDefinition: [
        splynx,
        "city",
      ],
    },
    dateAdd: {
      propDefinition: [
        splynx,
        "dateAdd",
      ],
    },
  },
  async run({ $ }) {
    const {
      splynx, partnerId, locationId, billingEmail, street, zipCode, dateAdd, ...data
    } = this;

    const response = await splynx.createCustomer({
      $,
      data: {
        ...data,
        partner_id: partnerId,
        location_id: locationId,
        billing_email: billingEmail,
        street_1: street,
        zip_code: zipCode,
        date_add: dateAdd,
      },
    });
    $.export(
      "$summary",
      `Successfully created customer "${this.name}" (ID: ${response.id})`,
    );
    return response;
  },
};
