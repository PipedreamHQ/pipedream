import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "clicksend",
  propDefinitions: {
    receiverPhoneNumber: {
      type: "string",
      label: "Receiver's Phone Number",
      description: "The phone number that received the SMS, in E.164 format.",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the received SMS message.",
    },
    recipientNumber: {
      type: "string",
      label: "Recipient's Number",
      description: "The recipient's phone number, in E.164 format.",
    },
    lengthOfVoiceMessage: {
      type: "integer",
      label: "Length of Voice Message",
      description: "The length of the voice message in seconds.",
    },
    audioMessageFile: {
      type: "string",
      label: "Audio Message File",
      description: "The URL to the audio file for the voice message.",
    },
    listId: {
      type: "integer",
      label: "List ID",
      description: "The ID of the list to add the contact to.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact, in E.164 format.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact.",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The SMS or MMS message to send.",
      optional: true,
    },
    fileUrl: {
      type: "string",
      label: "File URL",
      description: "The URL to the media file you want to send via MMS.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://rest.clicksend.com/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Basic ${Buffer.from(`${this.$auth.username}:${this.$auth.password}`).toString("base64")}`,
        },
      });
    },
    async createContact({
      listId, name, phoneNumber, email,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/lists/" + listId + "/contacts",
        data: {
          name,
          phone_number: phoneNumber,
          email,
        },
      });
    },
    async sendSms({
      recipientNumber, message,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/sms/send",
        data: {
          messages: [
            {
              to: recipientNumber,
              body: message,
            },
          ],
        },
      });
    },
    async sendMms({
      recipientNumber, fileUrl, message,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/mms/send",
        data: {
          messages: [
            {
              to: recipientNumber,
              media_file: fileUrl,
              body: message,
            },
          ],
        },
      });
    },
    async sendVoiceMessage({
      recipientNumber, lengthOfVoiceMessage, audioMessageFile,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/voice/send",
        data: {
          messages: [
            {
              to: recipientNumber,
              length: lengthOfVoiceMessage,
              audio_message_file: audioMessageFile,
            },
          ],
        },
      });
    },
  },
  version: "0.0.1",
};
