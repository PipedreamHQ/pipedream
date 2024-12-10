import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "cats",
  propDefinitions: {
    candidateId: {
      type: "integer",
      label: "Candidate ID",
      description: "The ID of the candidate.",
      async options({ page }) {
        const { _embedded } = await this.listCandidates({
          params: {
            page: page + 1,
          },
        });

        return _embedded
          ? _embedded.candidates.map(({
            id, first_name: fName, last_name: lName, emails: {
              primary, secondary,
            },
          }) => ({
            label: `${fName} ${lName} ${primary || secondary
              ? `(${primary || secondary})`
              : ""}`,
            value: parseInt(id),
          }))
          : [];
      },
    },
    companyId: {
      type: "integer",
      label: "Company ID",
      description: "The company ID related to the contact.",
      async options({ page }) {
        const { _embedded } = await this.listCompanies({
          params: {
            page: page + 1,
          },
        });

        return _embedded
          ? _embedded.companies.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    contactId: {
      type: "integer",
      label: "Contact Id",
      description: "The ID of the contact.",
      async options({ page }) {
        const { _embedded } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });

        return _embedded
          ? _embedded.contacts.map(({
            id, first_name: fName, last_name: lName, emails: { primary },
          }) => ({
            label: `${fName} ${lName} ${primary
              ? `(${primary})`
              : ""}`,
            value: parseInt(id),
          }))
          : [];
      },
    },
    ownerId: {
      type: "integer",
      label: "Owner ID",
      description: "The user id of the record owner.",
      async options({ page }) {
        const { _embedded } = await this.listUsers({
          params: {
            page: page + 1,
          },
        });

        return _embedded
          ? _embedded.users.map(({
            id: value, username: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "An array of custom field objects. ",
      async options({ page }) {
        const { _embedded } = await this.listCustomFields({
          params: {
            page: page + 1,
          },
        });

        return _embedded
          ? _embedded.custom_fields.map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    jobId: {
      type: "integer",
      label: "Job ID",
      description: "The ID of the job to which the record is added.",
      async options({ page }) {
        const { _embedded } = await this.listJobs({
          params: {
            page: page + 1,
          },
        });

        return _embedded
          ? _embedded.jobs.map(({
            id: value, title: label,
          }) => ({
            label,
            value,
          }))
          : [];
      },
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the record.",
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "The middle name of the record.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the record.",
    },
    checkDuplicate: {
      type: "boolean",
      label: "Check Duplicate",
      description: "When this flag is set to true, if a duplicate record is found to the one being created, an error will be thrown instead of creating a duplicate record.",
      default: false,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The record's job title.",
    },
    emails: {
      type: "string[]",
      label: "Emails",
      description: "An array of email objects. Each email object should contain two keys: `email` and `is_primary`, as described [here](https://docs.catsone.com/api/v3/#contacts-create-a-contact-email). **Format: {\"email\":\"example@email.com\", \"is_primary\":\"true\"}**",
    },
    isHot: {
      type: "boolean",
      label: "Is Hot",
      description: "Whether the record is marked as hot.",
    },
    phones: {
      type: "string[]",
      label: "Phones",
      description: "An array of phone objects. Each phone object should contain three keys: `number`, `extension`, and `type`, as described [here](https://docs.catsone.com/api/v3/#contacts-create-a-contact-phone). **Format: {\"number\":\"+16124063451\", \"extension\":\"8371\", \"type\":\"mobile\"}**. Type can be `mobile`, `home`, `work`, `fax`, `main` or `other`",
    },
    addressStreet: {
      type: "string",
      label: "Street Address",
      description: "The street of the record's address.",
    },
    addressCity: {
      type: "string",
      label: "City Address",
      description: "The city of the record's address.",
    },
    addressState: {
      type: "string",
      label: "State Address",
      description: "The state of the record's address.",
    },
    addressPostalCode: {
      type: "string",
      label: "Address Postal Code",
      description: "The postal code of the record's address.",
    },
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code of the record.",
    },
    socialMediaUrls: {
      type: "string[]",
      label: "Social Media URLs",
      description: "The social media URLs of the record.",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Any notes about the record.",
    },
    bestTimeToCall: {
      type: "string",
      label: "Best Time to Call",
      description: "The best time to call the record. **Format: HH:MM**.",
    },
    currentEmployer: {
      type: "string",
      label: "Current Employer",
      description: "The current employer of the record.",
    },
    desiredPay: {
      type: "string",
      label: "Desired Pay",
      description: "The desired pay for the record.",
    },
    isWillingToRelocate: {
      type: "boolean",
      label: "Willing to Relocate",
      description: "Whether the record is willing to relocate.",
    },
    keySkills: {
      type: "string",
      label: "Key Skills",
      description: "The key skills of the record.",
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the record.",
    },
    workHistory: {
      type: "string[]",
      label: "Work History",
      description: "An array of work history objects. **Example: {\"title\": \"Engineer\", \"employer\": { \"linked\": false, \"name\": \"<employer name>\", \"location\": { \"city\": \"<employer city>\", \"state\": \"<employer state>\" }}, \"supervisor\": { \"linked\": false, \"name\": \"<supervisor name>\", \"phone\": \"<supervisor phone number>\" }, \"is_verified\": true, \"is_current\": false, \"start_date\": \"YYYY-MM-DD\", \"end_date\": \"YYYY-MM-DD\", \"reason_for_leaving\": \"foo\"}**",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.catsone.com/v3";
    },
    _headers() {
      return {
        Authorization: `Token ${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      };
      console.log("config: ", config);
      return axios($, config);
    },
    listCandidates(opts = {}) {
      return this._makeRequest({
        path: "/candidates",
        ...opts,
      });
    },
    listCompanies(opts = {}) {
      return this._makeRequest({
        path: "/companies",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listCustomFields(opts = {}) {
      return this._makeRequest({
        path: "/contacts/custom_fields",
        ...opts,
      });
    },
    listJobs(opts = {}) {
      return this._makeRequest({
        path: "/jobs",
        ...opts,
      });
    },
    listUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    createCandidate(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/candidates",
        ...opts,
      });
    },
    addCandidateToJobPipeline(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/pipelines",
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
