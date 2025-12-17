import app from "../../remote_retrieval.app.mjs";

export default {
  key: "remote_retrieval-create-order",
  name: "Create Order",
  description: "Create order in Remote Retrieval. [See the documentation](https://www.remoteretrieval.com/api-integration/#create-order)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    typeOfEquipment: {
      propDefinition: [
        app,
        "typeOfEquipment",
      ],
    },
    orderType: {
      propDefinition: [
        app,
        "orderType",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    addressLine1: {
      propDefinition: [
        app,
        "addressLine1",
      ],
    },
    addressLine2: {
      propDefinition: [
        app,
        "addressLine2",
      ],
    },
    addressCity: {
      propDefinition: [
        app,
        "addressCity",
      ],
    },
    addressState: {
      propDefinition: [
        app,
        "addressState",
      ],
    },
    addressCountry: {
      propDefinition: [
        app,
        "addressCountry",
      ],
    },
    addressZip: {
      propDefinition: [
        app,
        "addressZip",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    returnPersonName: {
      propDefinition: [
        app,
        "returnPersonName",
      ],
    },
    returnCompanyName: {
      propDefinition: [
        app,
        "returnCompanyName",
      ],
    },
    returnAddressLine1: {
      propDefinition: [
        app,
        "returnAddressLine1",
      ],
    },
    returnAddressLine2: {
      propDefinition: [
        app,
        "returnAddressLine2",
      ],
    },
    returnAddressCity: {
      propDefinition: [
        app,
        "returnAddressCity",
      ],
    },
    returnAddressState: {
      propDefinition: [
        app,
        "returnAddressState",
      ],
    },
    returnAddressCountry: {
      propDefinition: [
        app,
        "returnAddressCountry",
      ],
    },
    returnAddressZip: {
      propDefinition: [
        app,
        "returnAddressZip",
      ],
    },
    companyEmail: {
      propDefinition: [
        app,
        "companyEmail",
      ],
    },
    companyPhone: {
      propDefinition: [
        app,
        "companyPhone",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.createOrder({
      $,
      data: {
        orders: [
          {
            type_of_equipment: this.typeOfEquipment,
            order_type: this.orderType,
            employee_info: {
              email: this.email,
              name: this.name,
              address_line_1: this.addressLine1,
              address_line_2: this.addressLine2 || "",
              address_city: this.addressCity,
              address_state: this.addressState,
              address_country: this.addressCountry,
              address_zip: this.addressZip,
              phone: this.phone,
            },
            company_info: {
              return_person_name: this.returnPersonName,
              return_company_name: this.returnCompanyName,
              return_address_line_1: this.returnAddressLine1,
              return_address_line_2: this.returnAddressLine2 || "",
              return_address_city: this.returnAddressCity,
              return_address_state: this.returnAddressState,
              return_address_country: this.returnAddressCountry,
              return_address_zip: this.returnAddressZip,
              email: this.companyEmail,
              phone: this.companyPhone,
            },
          },
        ],
      },
    });
    $.export("$summary", "Successfully created order");
    return response;
  },
};
