import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "benchmarkone",
  version: "0.0.{{ts}}",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact.",
      optional: true,
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "The email address of the contact.",
      optional: true,
    },
    noteContent: {
      type: "string",
      label: "Note Content",
      description: "The content of the note to add to the contact.",
    },
    tagNames: {
      type: "string[]",
      label: "Tag Names",
      description: "Names of the tags to add to the contact.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "Contact's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Contact's last name.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "Contact's email address.",
      optional: false,
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Phone numbers of the contact.",
      optional: true,
    },
    addresses: {
      type: "string[]",
      label: "Addresses",
      description: "Addresses of the contact.",
      optional: true,
    },
  },
  methods: {
    // Existing method
    authKeys() {
      console.log(Object.keys(this.$auth));
    },

    // Base URL for BenchmarkONE API
    _baseUrl() {
      return "https://api.hatchbuck.com/api/v1";
    },

    // Method to make HTTP requests
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, params, data, ...otherOpts
      } = opts;
      return axios($ || this, {
        method,
        url: this._baseUrl() + path,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        params: {
          ...params,
          api_key: this.$auth.api_key,
        },
        data,
        ...otherOpts,
      });
    },

    // Method to retrieve a contact by ID or search criteria
    async getContact({
      contactId, contactEmail,
    }) {
      if (contactId) {
        return this._makeRequest({
          method: "GET",
          path: `/contact/${contactId}`,
        });
      } else if (contactEmail) {
        return this._makeRequest({
          method: "POST",
          path: "/contact/search",
          data: {
            emails: [
              {
                address: contactEmail,
              },
            ],
          },
        });
      } else {
        throw new Error("Either contactId or contactEmail must be provided.");
      }
    },

    // Method to create a new contact
    async createContact({
      firstName, lastName, email, phoneNumbers, addresses,
    }) {
      if (!firstName || !lastName || !email) {
        throw new Error("First name, last name, and email are required to create a contact.");
      }
      return this._makeRequest({
        method: "POST",
        path: "/contact",
        data: {
          firstName,
          lastName,
          email,
          phones: phoneNumbers
            ? phoneNumbers.map((number) => ({
              number,
            }))
            : undefined,
          addresses: addresses
            ? addresses.map((address) => ({
              address,
            }))
            : undefined,
        },
      });
    },

    // Method to update an existing contact
    async updateContact({
      contactId, contactEmail, firstName, lastName, phoneNumbers, addresses,
    }) {
      if (!contactId && !contactEmail) {
        throw new Error("Either contactId or contactEmail must be provided to update a contact.");
      }
      const data = {
        ...(contactId
          ? {
            contactId,
          }
          : {}),
        ...(contactEmail
          ? {
            email: contactEmail,
          }
          : {}),
        ...(firstName
          ? {
            firstName,
          }
          : {}),
        ...(lastName
          ? {
            lastName,
          }
          : {}),
        ...(phoneNumbers
          ? {
            phones: phoneNumbers.map((number) => ({
              number,
            })),
          }
          : {}),
        ...(addresses
          ? {
            addresses: addresses.map((address) => ({
              address,
            })),
          }
          : {}),
      };
      return this._makeRequest({
        method: "PUT",
        path: "/contact",
        data,
      });
    },

    // Method to add a note to a contact
    async addNoteToContact({
      contactId, contactEmail, firstName, lastName, email, phoneNumbers, addresses, noteContent,
    }) {
      let contact;

      if (contactId) {
        contact = await this.getContact({
          contactId,
        });
      } else if (contactEmail) {
        const searchResults = await this.getContact({
          contactEmail,
        });
        if (Array.isArray(searchResults) && searchResults.length > 0) {
          contact = searchResults[0];
        } else {
          contact = await this.createContact({
            firstName,
            lastName,
            email,
            phoneNumbers,
            addresses,
          });
        }
      } else {
        throw new Error("Either contactId or contactEmail must be provided.");
      }

      const noteData = {
        subject: "New Note",
        body: noteContent,
        createdDateTime: new Date().toISOString(),
      };

      return this._makeRequest({
        method: "POST",
        path: `/contact/${contact.contactId}/notes`,
        data: noteData,
      });
    },

    // Method to add tags to a contact
    async addTagToContact({
      contactId, contactEmail, firstName, lastName, email, phoneNumbers, addresses, tagNames,
    }) {
      let contact;

      if (contactId) {
        contact = await this.getContact({
          contactId,
        });
      } else if (contactEmail) {
        const searchResults = await this.getContact({
          contactEmail,
        });
        if (Array.isArray(searchResults) && searchResults.length > 0) {
          contact = searchResults[0];
        } else {
          contact = await this.createContact({
            firstName,
            lastName,
            email,
            phoneNumbers,
            addresses,
          });
        }
      } else {
        throw new Error("Either contactId or contactEmail must be provided.");
      }

      const tagRequests = tagNames.map((name) => ({
        name,
      }));

      return this._makeRequest({
        method: "POST",
        path: `/contact/${contact.contactId}/tags`,
        data: tagRequests,
      });
    },
  },
};
