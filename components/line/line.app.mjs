import { Client } from "@line/bot-sdk";
import qs from "qs";

export default {
  type: "app",
  app: "line",
  propDefinitions: {
    channelAccessToken: {
      label: "Channel Access Token",
      type: "string",
      description: "The access token of a group or room.",
      secret: true,
    },
    message: {
      label: "Message Text",
      type: "string",
      description: "The text of message to be send.",
    },
    notificationDisabled: {
      label: "Notification Disabled",
      type: "boolean",
      description: "The user will receive a push notification when the message is sent.",
      default: false,
      optional: true,
    },
  },
  methods: {
    /**
     * Get the access token;
     *
     * @returns {string} The access token.
     */
    _accessToken() {
      return this.$auth.oauth_access_token;
    },

    /**
     * Instantiate a Line's Client.
     *
     * @param {string} channelAccessToken - The access token of the channel
     * to instantiate the client.
     *
     * @returns {Client} The Line's client instance.
     */
    createLineClient(channelAccessToken) {
      return new Client({
        channelAccessToken: channelAccessToken,
      });
    },

    /**
     * Will convert a JSON object to a x-www-form-urlencoded string.
     *
     * @param {string} params - The JSON object params that will be converted.
     *
     * @returns {string} The x-www-form-urlencoded string.
     */
    convertJSONToUrlEncodec(params) {
      return qs.stringify(params);
    },
  },
};
