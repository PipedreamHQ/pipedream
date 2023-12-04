import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "convolo_ai",
  propDefinitions: {
    endOfCallTrigger: {
      type: "boolean",
      label: "End of Call Trigger",
      description: "Trigger when a call ends and gets logged in Convolo dashboard",
    },
    agentIdentifier: {
      type: "string",
      label: "Agent Identifier",
      description: "The identifier of the agent to initiate a call with",
    },
    leadPhoneNumber: {
      type: "string",
      label: "Lead Phone Number",
      description: "The phone number of the lead to call",
    },
    contactDetails: {
      type: "string[]",
      label: "Contact Details",
      description: "An array of objects containing the details of the contact to incorporate into a power dialer project",
    },
    powerDialerProjectIdentifier: {
      type: "string",
      label: "Power Dialer Project Identifier",
      description: "The identifier of the power dialer project to add a new contact to",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.convolo.ai";
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
    async logCallEnd({ endOfCallTrigger }) {
      if (endOfCallTrigger) {
        // Logic to log the end of the call
        // Since the API documentation link is not available, the exact endpoint and method are not defined
        // This is a placeholder for where the API request would be made
      }
    },
    async initiatePhoneCall({
      agentIdentifier, leadPhoneNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/initiate-call", // Placeholder path, replace with actual API endpoint
        data: {
          agentIdentifier,
          leadPhoneNumber,
        },
      });
    },
    async addContactToPowerDialer({
      contactDetails, powerDialerProjectIdentifier,
    }) {
      const parsedContactDetails = contactDetails.map(JSON.parse);
      return this._makeRequest({
        method: "POST",
        path: "/add-contact", // Placeholder path, replace with actual API endpoint
        data: {
          contactDetails: parsedContactDetails,
          powerDialerProjectIdentifier,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
