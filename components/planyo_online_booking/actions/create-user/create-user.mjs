import planyo from "../../planyo_online_booking.app.mjs";

export default {
  name: "Create User",
  key: "planyo_online_booking-create-user",
  description: "Inserts a new user associated with your Planyo site. [See Docs](https://www.planyo.com/api.php?topic=add_user)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    planyo,
    email: {
      propDefinition: [
        planyo,
        "email",
      ],
      optional: false,
    },
    firstName: {
      propDefinition: [
        planyo,
        "firstName",
      ],
      optional: false,
    },
    lastName: {
      propDefinition: [
        planyo,
        "lastName",
      ],
    },
    address: {
      propDefinition: [
        planyo,
        "address",
      ],
    },
    city: {
      propDefinition: [
        planyo,
        "city",
      ],
    },
    state: {
      propDefinition: [
        planyo,
        "state",
      ],
    },
    zip: {
      propDefinition: [
        planyo,
        "zip",
      ],
    },
    country: {
      propDefinition: [
        planyo,
        "country",
      ],
    },
    phonePrefix: {
      propDefinition: [
        planyo,
        "phonePrefix",
      ],
    },
    phoneNumber: {
      propDefinition: [
        planyo,
        "phoneNumber",
      ],
    },
    resourceId: {
      propDefinition: [
        planyo,
        "resourceId",
      ],
    },
    quantity: {
      propDefinition: [
        planyo,
        "quantity",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.planyo.createUser({
      params: {
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
        phone_prefix: this.phonePrefix,
        phone_number: this.phoneNumber,
        resource_id: this.resourceId,
        quantity: this.quantity,
      },
    });

    $.export("$summary", response.response_message);

    return response;
  },
};
