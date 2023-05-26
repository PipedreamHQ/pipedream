import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "constant_contact",
  propDefinitions: {
    anniversary: {
      type: "string",
      label: "Anniversary",
      description: "The anniversary date for the contact. For example, this value could be the date when the contact first became a customer of an organization in Constant Contact. Valid date formats are MM/DD/YYYY, M/D/YYYY, YYYY/MM/DD, YYYY/M/D, YYYY-MM-DD, YYYY-M-D,M-D-YYYY, or M-DD-YYYY.",
    },
    birthdayDay: {
      type: "string",
      label: "Birthday Day",
      description: "The day value for the contact's birthday. The `birthdayDay` is required if you use `birthdayMonth`.",
    },
    birthdayMonth: {
      type: "string",
      label: "Birthday Month",
      description: "The month value for the contact's birthday. The `birthdayMonth` is required if you use `birthdayDay`.",
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company where the contact works.",
    },
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "Unique ID of contact",
      async options({ page }) {
        const { contacts: data } = await this.listContacts({
          params: {
            page,
          },
        });

        return data.map(({
          contact_id: value, email_address: { address: label },
        }) => ({
          label,
          value,
        }));
      },
    },
    createSource: {
      type: "string",
      label: "Create Source",
      description: "Describes who added the contact. Your integration must accurately identify `create_source` for compliance reasons. value is set on POST, and is read-only going forward.",
      options: [
        "Account",
        "Contact",
      ],
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Array of up to 25 `custom_field` key value pairs. Each item must be an object containing `custom_field_id` and `value` fields. E.g.`{\"custom_field_id\":1, \"value\":\"The custom_field value.\"}`",
    },
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The contact's email address.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact.",
    },
    jobTitle: {
      type: "string",
      label: "Job Title",
      description: "The job title of the contact.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact.",
    },
    listMembership: {
      type: "string[]",
      label: "List Membership",
      description: "Array of lists to which the contact is being subscribed, up to a maximum of 50.",
      async options({ page }) {
        const { lists: data } = await this.listLists({
          params: {
            page,
          },
        });

        return data.map(({
          list_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    notes: {
      type: "string[]",
      label: "Notes",
      description: "Array of notes about the contact. Each item must be an object containing `note_id` (The ID that uniquely identifies the note - UUID format), `created_at` (The date that the note was created) and `content` (The content for the note). E.g.`{\"note_id\":\"123123123\", \"created_at\":\"1970-01-01\", \"content\":\"Content example of the note about the contact\"}`",
    },
    permissionToSend: {
      type: "string",
      label: "Permission To Send",
      description: "Identifies the type of permission that the Constant Contact account has been granted to send email to the contact.",
      options: [
        "implicit",
        "explicit",
        "pending_confirmation",
        "unsubscribed",
        "temp_hold",
        "not_set",
      ],
    },
    phoneNumbers: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Array of up to 3 phone numbers subresources. Each item must be an object containing `phone_number` and `kind` fields. E.g.`{\"phone_number\":12345678, \"kind\":\"other\"}`. The `kind` field can be `home`, `work`, `mobile` or `other`",
    },
    streetAddresses: {
      type: "string[]",
      label: "Street Address",
      description: "Array of up to 3 street address subresources. Each item must be an object containing `kind`, `street`, `city`, `state`, `postal_code` and `country` fields. E.g.`{\"kind\":\"home\", \"street\":\"123 example st.\", \"city\":\"New York\", \"state\":\"NY\", \"postal_code\":\"10002\", \"country\":\"United States\", }`. The `kind` field can be `home`, `work` or `other`",
    },
    taggings: {
      type: "string[]",
      label: "Taggings",
      description: "Array of tags assigned to the contact, up to a maximum of 50.",
      async options({ page }) {
        const { tags: data } = await this.listTags({
          params: {
            page,
          },
        });

        return data.map(({
          tag_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.cc.email/v3";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createContact(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "contacts",
        ...args,
      });
    },
    deleteContact({
      $, contactId,
    }) {
      return this._makeRequest({
        $,
        method: "DELETE",
        path: `contacts/${contactId}`,
      });
    },
    getContact({
      $, contactId,
    }) {
      return this._makeRequest({
        $,
        path: `contacts/${contactId}`,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    listLists(args = {}) {
      return this._makeRequest({
        path: "contact_lists",
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "contact_tags",
        ...args,
      });
    },
    updateContact({
      contactId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `contacts/${contactId}`,
        ...args,
      });
    },
    async *paginate({
      fn, field, params = {}, maxResults = null,
    }) {
      let nextPage = "";
      let count = 0;

      do {
        params.cursor = nextPage.split("cursor=")[1];
        const response = await fn({
          params,
        });
        const items = response[field];
        const { _links } = response;
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        nextPage = _links?.next?.href;

      } while (nextPage);
    },
  },
};
