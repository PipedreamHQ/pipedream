import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wildapricot",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier for the contact",
    },
    memberId: {
      type: "string",
      label: "Member ID",
      description: "The unique identifier for the member",
    },
    eventId: {
      type: "string",
      label: "Event ID",
      description: "The unique identifier for the event",
    },
    paymentId: {
      type: "string",
      label: "Payment ID",
      description: "The unique identifier for the payment",
    },
    paymentDate: {
      type: "string",
      label: "Payment Date",
      description: "The date of the payment",
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact",
    },
    registrationId: {
      type: "string",
      label: "Registration ID",
      description: "The unique identifier for the registration",
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "The details of the contact or member",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.wildapricot.org/v2";
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
    async updateContactOrMember({
      contactId, memberId, contactDetails,
    }) {
      return this._makeRequest({
        path: `/contacts/${contactId || memberId}`,
        method: "PUT",
        data: contactDetails,
      });
    },
    async createEventRegistration({
      eventId, contactDetails,
    }) {
      return this._makeRequest({
        path: `/events/${eventId}/registrations`,
        method: "POST",
        data: contactDetails,
      });
    },
    async getPayment({ paymentId }) {
      return this._makeRequest({
        path: `/payments/${paymentId}`,
      });
    },
    async searchAndUpdateEventRegistration({
      contactEmail, registrationId, contactDetails,
    }) {
      const { items: registrations } = await this._makeRequest({
        path: "/contacts",
        params: {
          email: contactEmail,
        },
      });
      if (registrations.length) {
        return this._makeRequest({
          path: `/registrations/${registrations[0].Id || registrationId}`,
          method: "PUT",
          data: contactDetails,
        });
      } else {
        return this._makeRequest({
          path: "/registrations",
          method: "POST",
          data: contactDetails,
        });
      }
    },
    async removeEventRegistration({ registrationId }) {
      return this._makeRequest({
        path: `/registrations/${registrationId}`,
        method: "DELETE",
      });
    },
    async addOrUpdateContactOrMember({ contactDetails }) {
      if (contactDetails.Id) {
        return this._makeRequest({
          path: `/contacts/${contactDetails.Id}`,
          method: "PUT",
          data: contactDetails,
        });
      } else {
        return this._makeRequest({
          path: "/contacts",
          method: "POST",
          data: contactDetails,
        });
      }
    },
  },
};
