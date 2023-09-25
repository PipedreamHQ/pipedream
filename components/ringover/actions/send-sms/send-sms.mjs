import { axios } from "@pipedream/platform";
import ringover from "../../ringover.app.mjs";

export default {
  key: "ringover-send-sms",
  name: "Send SMS",
  description: "Sends an SMS using Ringover. [See the documentation](https://developer.ringover.com/?_ga=2.63646317.316145444.1695076986-652152469.1694643800#tag/sms/paths/~1push~1sms/post)",
  version: "0.0.1",
  type: "action",
  props: {
    ringover,
    number: {
      type: "string",
      label: "Number",
      description: "The phone number to send the SMS to",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the SMS to send",
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "The user ID to send the SMS from",
      optional: true,
    },
    callBackUrl: {
      type: "string",
      label: "Callback URL",
      description: "The callback URL to receive delivery notifications",
      optional: true,
    },
    callBackMethod: {
      type: "string",
      label: "Callback Method",
      description: "The HTTP method for the callback",
      optional: true,
    },
  },
  methods: {
    sendSms: async function({
      $, data,
    }) {
      return axios($, {
        method: "POST",
        url: "https://public-api.ringover.com/v2/push/sms",
        headers: {
          "Authorization": `${this.ringover.$auth.api_key}`,
          "accept": "application/json",
        },
        data,
      });
    },
  },
  async run({ $ }) {
    const data = {
      number: this.number,
      text: this.text,
      user_id: this.userId,
      callback_url: this.callBackUrl,
      callback_method: this.callBackMethod,
    };
    const response = await this.sendSms({
      $,
      data,
    });
    $.export("$summary", "Successfully sent SMS");
    return response;
  },
};
