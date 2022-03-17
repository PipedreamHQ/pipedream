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
    createLineClient(channelAccessToken) {
      return new Client({
        channelAccessToken: channelAccessToken,
      });
    },
    generateFormUrlEncodec(params) {
      return qs.stringify(params);
    },
  },
};
