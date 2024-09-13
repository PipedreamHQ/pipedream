import app from "../../altiria.app.mjs";

export default {
  key: "altiria-send-sms",
  name: "Send SMS",
  description: "Send an SMS message. The message will be sent to the phone numbers you specify. [See the documentation](https://static.altiria.com/especificaciones/altiria_push_rest.pdf).",
  type: "action",
  version: "0.0.1",
  props: {
    app,
    destination: {
      type: "string[]",
      label: "Destination Phone Numbers",
      description: "The phone numbers to which the message will be sent. Each number will be specified in international numbering format without the prefix `00` or the sign `+`. Eg: `34645852126`. It is essential to include the country prefix (`34` for Spain) so that the message reaches the expected destination. It must not exceed 16 digits. In any case, it is recommended not to exceed **100** phone numbers per request.",
    },
    msg: {
      type: "string",
      label: "Message",
      description: "Message to send. The list of valid characters and the maximum allowed length is detailed in section 2.4 of the [documentation](https://static.altiria.com/especificaciones/altiria_push_rest.pdf). It cannot be empty (empty string). Mobile web identifiers can be added to generate unique shortened links in the message body. See section 2.5 for more details on mobile webs.",
    },
  },
  methods: {
    sendSms(args = {}) {
      return this.app.post({
        path: "/sendSms",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      sendSms,
      destination,
      msg,
    } = this;

    const response = await sendSms({
      $,
      data: {
        destination,
        message: {
          msg,
        },
      },
    });

    $.export("$summary", "Successfully sent SMS message.");

    return response;
  },
};
