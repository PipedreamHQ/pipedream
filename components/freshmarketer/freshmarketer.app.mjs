import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "freshmarketer",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email of the contact",
      optional: true,
    },
    contactDetails: {
      type: "object",
      label: "Contact Details",
      description: "The details of the contact including first name, last name, phone, etc.",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://domain.myfreshworks.com/crm/sales/api";
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
          "Authorization": `Token token=${this.$auth.token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async addContactToList({
      listId, contactDetails,
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/lists/${listId}/add_contacts`,
        data: contactDetails,
      });
    },
    async removeContactFromList({
      listId, contactId, contactEmail,
    }) {
      const data = contactId
        ? {
          ids: [
            contactId,
          ],
        }
        : {
          email: contactEmail,
        };
      return this._makeRequest({
        method: "PUT",
        path: `/lists/${listId}/remove_contacts`,
        data,
      });
    },
    async searchContactByEmail({ email }) {
      return this._makeRequest({
        method: "GET",
        path: `/contacts?email=${email}`,
      });
    },
    async updateContact({ contactDetails }) {
      return this._makeRequest({
        method: "PUT",
        path: "/contacts",
        data: contactDetails,
      });
    },
    async addOrUpdateContact({
      listId, contactDetails,
    }) {
      const contactSearchResult = await this.searchContactByEmail({
        email: contactDetails.email,
      });
      if (contactSearchResult && contactSearchResult.contact && contactSearchResult.contact.id) {
        return this.updateContact({
          contactDetails,
        });
      } else {
        return this.addContactToList({
          listId,
          contactDetails,
        });
      }
    },
    async removeContactByEmailOrId({
      email, contactId, listId,
    }) {
      if (email) {
        const contactSearchResult = await this.searchContactByEmail({
          email,
        });
        if (contactSearchResult && contactSearchResult.contact && contactSearchResult.contact.id) {
          contactId = contactSearchResult.contact.id;
        } else {
          throw new Error("Contact not found");
        }
      }
      if (!contactId) {
        throw new Error("Contact ID is required");
      }
      return this.removeContactFromList({
        listId,
        contactId,
      });
    },
  },
};
