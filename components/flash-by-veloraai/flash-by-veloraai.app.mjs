import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "flash_system",
  propDefinitions: {
    feedbackContent: {
      type: "string",
      label: "Feedback Content",
      description: "The content of the customer feedback",
    },
    customerId: {
      type: "string",
      label: "Customer ID",
      description: "ID of the customer providing the feedback",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description: "Email of the customer providing the feedback",
      optional: true,
    },
    transcriptContent: {
      type: "string",
      label: "Transcript Content",
      description: "Content of the contact call transcript",
    },
    callId: {
      type: "string",
      label: "Call ID",
      description: "ID of the call for the transcript",
    },
    callerId: {
      type: "string",
      label: "Caller ID",
      description: "ID of the caller for the transcript",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flashsystem.com";
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
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async sendFeedback({
      feedbackContent, customerId, customerEmail,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/feedback",
        data: {
          feedback_content: feedbackContent,
          customer_id: customerId,
          customer_email: customerEmail,
        },
      });
    },
    async sendTranscript({
      transcriptContent, callId, callerId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/transcripts",
        data: {
          transcript_content: transcriptContent,
          call_id: callId,
          caller_id: callerId,
        },
      });
    },
  },
};
