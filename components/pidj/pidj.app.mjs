import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pidj",
  propDefinitions: {
    contactInformation: {
      type: "object",
      label: "Contact's Information",
      description: "The contact's information including name, email, and phone number.",
    },
    additionalNotes: {
      type: "string",
      label: "Additional Notes",
      description: "Any additional notes related to the contact.",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags related to the contact.",
      optional: true,
    },
    recipientPhoneNumber: {
      type: "string",
      label: "Recipient's Phone Number",
      description: "The phone number of the message recipient.",
    },
    messageText: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to be sent.",
    },
    scheduledSendTime: {
      type: "string",
      label: "Scheduled Send Time",
      description: "The scheduled time to send the message, in ISO 8601 format.",
      optional: true,
    },
    surveyId: {
      type: "string",
      label: "Survey ID",
      description: "The ID of the survey to be triggered.",
    },
    scheduleTimeForSurvey: {
      type: "string",
      label: "Schedule Time for Survey",
      description: "The scheduled time to initiate the survey, in ISO 8601 format.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.gopidj.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          ...headers,
        },
        data,
        params,
        ...otherOpts,
      });
    },
    async addContact({
      contactInformation, additionalNotes, tags,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          contactInformation,
          additionalNotes,
          tags,
        },
      });
    },
    async sendMessage({
      recipientPhoneNumber, messageText, scheduledSendTime,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/messages/send",
        data: {
          recipientPhoneNumber,
          messageText,
          scheduledSendTime,
        },
      });
    },
    async triggerSurvey({
      contactInformation, surveyId, scheduleTimeForSurvey,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/surveys/trigger",
        data: {
          contactInformation,
          surveyId,
          scheduleTimeForSurvey,
        },
      });
    },
  },
};
