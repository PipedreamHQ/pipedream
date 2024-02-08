import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "whatsable",
  propDefinitions: {
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number to send the message to, in E164 format (e.g., +34677327718). Hyphens will be removed if included.",
      async options() {
        // Assuming there's a method to list verified phone numbers
        const phoneNumbers = await this.listVerifiedPhoneNumbers();
        return phoneNumbers.map((number) => ({
          label: number,
          value: number.replace(/-/g, ""),
        }));
      },
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send to the phone number.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.whatsable.app/api";
    },
    _sanitizePhoneNumber(phoneNumber) {
      // Remove hyphens and ensure it starts with a plus sign for E164 format
      return `+${phoneNumber.replace(/-/g, "")}`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "POST", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async sendMessage({
      phoneNumber, message,
    }) {
      const sanitizedNumber = this._sanitizePhoneNumber(phoneNumber);
      return this._makeRequest({
        path: "/sendMessage",
        data: {
          phone: sanitizedNumber,
          message: message,
        },
      });
    },
    async listVerifiedPhoneNumbers() {
      // Placeholder for listing verified phone numbers
      // This method should be implemented to retrieve verified phone numbers
      // from the WhatsAble account or service
      return [];
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
  version: "0.0.{{ts}}",
};
