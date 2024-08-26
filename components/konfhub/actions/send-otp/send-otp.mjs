import konfhub from "../../konfhub.app.mjs";

export default {
  key: "konfhub-send-otp",
  name: "Send OTP",
  description: "Send a one-time password (OTP) to a user. [See the documentation](https://docs.konfhub.com/#api-Referral-Registration-Send_OTP)",
  version: "0.0.1",
  type: "action",
  props: {
    konfhub,
    eventId: {
      propDefinition: [
        konfhub,
        "eventId",
      ],
    },
    eventName: {
      type: "string",
      label: "Event Name",
      description: "Name of the event",
    },
    email: {
      propDefinition: [
        konfhub,
        "email",
      ],
    },
    userName: {
      type: "string",
      label: "User Name",
      description: "Name of the user",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      konfhub,
      eventId,
      eventName,
      email,
      userName,
    } = this;

    const response = await konfhub.sendOTP({
      $,
      eventId,
      params: {
        email_id: email,
        event_name: eventName,
        user_name: userName,
      },
    });

    $.export("$summary", `Successfully sent OTP to "${email}"`);
    return response;
  },
};
