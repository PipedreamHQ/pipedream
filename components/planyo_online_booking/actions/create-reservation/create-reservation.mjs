import planyo from "../../planyo_online_booking.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  name: "Create Reservation",
  key: "planyo_online_booking-create-reservation",
  description: "Enters a new reservation into the system. [See Docs](https://www.planyo.com/api.php?topic=make_reservation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    planyo,
    startTime: {
      propDefinition: [
        planyo,
        "startTime",
      ],
    },
    endTime: {
      propDefinition: [
        planyo,
        "endTime",
      ],
    },
    resourceId: {
      propDefinition: [
        planyo,
        "resourceId",
      ],
      optional: false,
    },
    quantity: {
      propDefinition: [
        planyo,
        "quantity",
      ],
      optional: false,
    },
    userId: {
      propDefinition: [
        planyo,
        "userId",
      ],
    },
    email: {
      propDefinition: [
        planyo,
        "email",
      ],
      description: "User's email address. This field is required only if user_id is not set.",
    },
    firstName: {
      propDefinition: [
        planyo,
        "firstName",
      ],
      description: "User's first name. This field is required only if user_id is not set.",
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
  },
  async run({ $ }) {
    if (!this.userId && !(this.email && this.firstName)) {
      throw new ConfigurationError("Either `userId` or both `email` and `firstName` must be provided.");
    }

    const response = await this.planyo.createReservation({
      params: {
        admin_mode: true,
        start_time: this.startTime,
        end_time: this.endTime,
        user_id: this.userId,
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
