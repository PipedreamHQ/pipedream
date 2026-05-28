import { Client } from "@line/bot-sdk";
import qs from "qs";
import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "line",
  propDefinitions: {
    channelAccessToken: {
      label: "Channel Access Token",
      type: "string",
      description: "The access token of a group or room. Please refer to [the Line doc here to get the channel access token](https://developers.line.biz/en/docs/messaging-api/channel-access-tokens/#long-lived-channel-access-tokens)",
      secret: true,
    },
    message: {
      label: "Message Text",
      type: "string",
      description: "The text of message to be send.",
    },
    notificationDisabled: {
      label: "Disable Notification",
      type: "boolean",
      description: "The user will receive a push notification when the message is sent.",
      default: false,
      optional: true,
    },
  },
  methods: {
    /**
     * Get the base api url;
     *
     * @returns {string} The base api url.
     */
    _apiUrl() {
      return "https://notify-api.line.me/api";
    },
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
    convertJSONToUrlEncoded(params) {
      return qs.stringify(params);
    },

    /**
     * Will send a broadcast message to a specific channel or room.
     *
     * @param {string} channelAccessToken - The channel or room access token.
     * @param {object} message - The message object.
     *
     * @returns {object} The Line Client object response .
     */
    async sendBroadcastMessage(channelAccessToken, message) {
      const client = this.createLineClient(channelAccessToken);

      return client.broadcast(message);
    },

    /**
     * Will send a reply message to a specific message.
     *
     * @param {string} channelAccessToken - The channel or room access token.
     * @param {string} replyToken - The token for reply a specific message.
     * @param {object} message - The message object.
     *
     * @returns {object} The Line Client object response.
     */
    async sendReplyMessage(channelAccessToken, replyToken, message) {
      const client = this.createLineClient(channelAccessToken);

      return client.replyMessage(replyToken, message);
    },

    /**
     * Will send a push message to a specific user.
     *
     * @param {string} channelAccessToken - The channel or room access token.
     * @param {string} to - The id of user to send the message.
     * @param {object} message - The message object.
     *
     * @returns {object} The Line Client object response.
     */
    async sendPushMessage(channelAccessToken, to, message) {
      const client = this.createLineClient(channelAccessToken);

      return client.pushMessage(to, message);
    },

    /**
     * Will send a notification to a specific message.
     *
     * @param {string} $ - Pipedream object to get the params for the request.
     * @param {object} message - The message object.
     * @param {string} accessToken - The access token of a user, channel or room,
     * if this this param is not provided, will use the current account access token.
     *
     * @returns {object} The Line Client object response.
     */
    async sendNotification($, message, accessToken) {
      return axios($, {
        url: `${this._apiUrl()}/notify`,
        method: "post",
        data: this.convertJSONToUrlEncoded(message),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${accessToken ?? this._accessToken()}`,
        },
      });
    },
  },
};
