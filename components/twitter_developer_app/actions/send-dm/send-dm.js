const twitter = require("../../twitter_developer_app.app.js");
const Twit = require("twit");

module.exports = {
  key: "twitter_developer_app-send-dm",
  name: "Send Direct Message (DM)",
  description: "Send a DM to a user.",
  version: "0.0.2",
  type: "action",
  props: {
    twitter,
    recipient_id: {
      type: "string",
      label: "Recipient ID",
      description: "The ID of the user who should receive the direct message. You must pass the string value of the numeric id (i.e, the value for the `id_str` field in Twitter's `user` object). For example, the correct ID to send a DM to `@pipedream` is `1067926271856766976`. If you only have the user's screen name, lookup the user first and pass the `id_str` to this field.",
    },
    message: {
      type: "string",
      description: "The text of your direct message. Max length of 10,000 characters. Max length of 9,990 characters if used as a [Welcome Message](https://developer.twitter.com/en/docs/direct-messages/welcome-messages/api-reference/new-welcome-message).",
    },
  },
  async run() {
    const {
      api_key, api_secret_key, access_token, access_token_secret,
    } = this.twitter.$auth;

    const T = new Twit({
      consumer_key: api_key,
      consumer_secret: api_secret_key,
      access_token,
      access_token_secret,
      timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
      strictSSL: true,  // optional - requires SSL certificates to be valid.
    });

    const response = await T.post("direct_messages/events/new", {
      "event": {
        "type": "message_create",
        "message_create": {
          "target": {
            "recipient_id": this.recipient_id,
          },
          "message_data": {
            "text": this.message,
          },
        },
      },
    });

    return response.data.event;
  },
};
