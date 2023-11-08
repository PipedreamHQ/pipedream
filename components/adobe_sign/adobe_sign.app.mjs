import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "adobe_sign",
  propDefinitions: {
    libraryEvent: {
      type: "string",
      label: "Library Event",
      description: "The library event to listen for",
      options: [
        {
          label: "All Library Events",
          value: "LIBRARY_ALL",
        },
        {
          label: "Library Document Auto Cancelled Due to Conversion Problem",
          value: "LIBRARY_DOCUMENT_AUTO_CANCELLED_CONVERSION_PROBLEM",
        },
        {
          label: "Library Document Created",
          value: "LIBRARY_DOCUMENT_CREATED",
        },
        {
          label: "Library Document Modified",
          value: "LIBRARY_DOCUMENT_MODIFIED",
        },
      ],
    },
    bulkSigningEvent: {
      type: "string",
      label: "Bulk Signing Event",
      description: "The bulk signing event to listen for",
      options: [
        {
          label: "All Bulk Signing Events",
          value: "MEGASIGN_ALL",
        },
        {
          label: "Bulk Signing Created",
          value: "MEGASIGN_CREATED",
        },
        {
          label: "Bulk Signing Recalled",
          value: "MEGASIGN_RECALLED",
        },
        {
          label: "Bulk Signing Shared",
          value: "MEGASIGN_SHARED",
        },
        {
          label: "Bulk Signing Reminder Initiated",
          value: "MEGASIGN_REMINDER_INITIATED",
        },
        {
          label: "Bulk Signing Reminder Sent",
          value: "MEGASIGN_REMINDER_SENT",
        },
      ],
    },
    email: {
      type: "string",
      label: "Recipient Email",
      description: "The email address to send the agreement to",
    },
    agreementId: {
      type: "string",
      label: "Agreement ID",
      description: "The unique identifier of the agreement",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.adobesign.com/api/rest/v6";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createAgreement({
      email, ...data
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/agreements",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          ...data,
          participantSetsInfo: [
            {
              memberInfos: [
                {
                  email,
                },
              ],
              order: 1,
              role: "SIGNER",
            },
          ],
        },
      });
    },
    async getAgreementStatus({ agreementId }) {
      return this._makeRequest({
        path: `/agreements/${agreementId}`,
      });
    },
    async updateAgreementStatus({
      agreementId, ...data
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/agreements/${agreementId}/state`,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
