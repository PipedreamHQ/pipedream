import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendsms",
  propDefinitions: {
    destinationNumber: {
      type: "string",
      label: "Destination Number",
      description: "The phone number to send the SMS to, in E.164 format without the + sign (e.g., 40727363767).",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "The content of the SMS message.",
    },
    phoneNumberToCheck: {
      type: "string",
      label: "Phone Number to Check",
      description: "The phone number to check in the blocklist, in E.164 format without the + sign (e.g., 40727363767).",
    },
    groupId: {
      type: "integer",
      label: "Group ID",
      description: "The ID of the group to add the contact to.",
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "Details of the contact to add, including phone number, first name, and last name.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sendsms.ro/json";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path, headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      });
    },
    async sendSms({
      destinationNumber, messageContent,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `?action=message_send&username=${this.$auth.username}&password=${this.$auth.password}&to=${destinationNumber}&text=${encodeURIComponent(messageContent)}`,
      });
    },
    async checkBlocklist({ phoneNumberToCheck }) {
      return this._makeRequest({
        path: `?action=blocklist_check&username=${this.$auth.username}&password=${this.$auth.password}&phonenumber=${phoneNumberToCheck}`,
      });
    },
    async addContactToGroup({
      groupId, contactDetails,
    }) {
      const {
        phoneNumber, firstName, lastName,
      } = contactDetails;
      return this._makeRequest({
        method: "POST",
        path: `?action=address_book_contact_add&username=${this.$auth.username}&password=${this.$auth.password}&group_id=${groupId}&phone_number=${phoneNumber}&first_name=${firstName}&last_name=${lastName}`,
      });
    },
  },
};
