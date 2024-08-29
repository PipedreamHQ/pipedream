import konfhub from "../../konfhub.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "konfhub-validate-registration",
  name: "Validate Registration",
  description: "Validate a user's email or phone number for a given event. [See the documentation](https://docs.konfhub.com/#api-Common_APIs-Registration_Validation)",
  version: "0.0.1",
  type: "action",
  props: {
    konfhub,
    docsAlert: {
      type: "alert",
      alertType: "info",
      content: `[See the documentation](https://docs.konfhub.com/#api-Common_APIs-Registration_Validation) for details on the different verification methods available via this action.
\\
At least one of \`Email Address\` or \`Phone Number\` is required.`,
    },
    email: {
      propDefinition: [
        konfhub,
        "email",
      ],
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the user (with country code)",
      optional: true,
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "Country code of the phone number, e.g. `+91` or `91`",
      optional: true,
    },
    eventId: {
      propDefinition: [
        konfhub,
        "eventId",
      ],
      optional: true,
    },
    ticketId: {
      type: "string",
      label: "Ticket ID",
      description: "ID of the ticket purchased",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      konfhub,
      email,
      phone,
      countryCode,
      eventId,
      ticketId,
    } = this;

    if (!email && !phone) {
      throw new ConfigurationError("At least one of `Email Address` or `Phone Number` is required");
    }

    const response = await konfhub.validateRegistration({
      $,
      params: {
        email_id: email,
        phone_number: phone,
        country_code: countryCode,
        event_id: eventId,
        ticket_id: ticketId,
      },
    });

    $.export("$summary", "Successfully verified registration");
    return response;
  },
};
