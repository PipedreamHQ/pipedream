import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "salespype",
  version: "0.0.{{ts}}",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact",
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The unique identifier of the campaign",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email address of the contact",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The city of the contact",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The state of the contact",
      optional: true,
    },
    zip: {
      type: "string",
      label: "ZIP Code",
      description: "The ZIP code of the contact",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The country of the contact",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the contact",
      optional: true,
    },
    birthDate: {
      type: "string",
      label: "Birthdate",
      description: "The birthdate of the contact",
      optional: true,
    },
    task: {
      type: "string",
      label: "Task",
      description: "The task description",
    },
    taskTypeId: {
      type: "string",
      label: "Task Type ID",
      description: "The unique identifier of the task type",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date for the task",
      optional: true,
    },
    time: {
      type: "string",
      label: "Time",
      description: "The time for the task",
      optional: true,
    },
    duration: {
      type: "string",
      label: "Duration",
      description: "The duration of the task",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional notes for the task",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.salespype.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        ...otherOpts,
      });
    },
    async createContact(opts = {}) {
      const {
        firstName,
        lastName,
        email,
        address,
        city,
        state,
        zip,
        country,
        companyName,
        birthDate,
      } = opts;
      const data = {
        first_name: firstName,
        last_name: lastName,
        email,
        ...(address && {
          address,
        }),
        ...(city && {
          city,
        }),
        ...(state && {
          state,
        }),
        ...(zip && {
          zip,
        }),
        ...(country && {
          country,
        }),
        ...(companyName && {
          company_name: companyName,
        }),
        ...(birthDate && {
          birthdate: birthDate,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data,
      });
    },
    async updateContact(opts = {}) {
      const {
        contactId,
        firstName,
        lastName,
        email,
        address,
        city,
        state,
        zip,
        country,
        companyName,
        birthDate,
      } = opts;
      const data = {
        first_name: firstName,
        last_name: lastName,
        email,
        ...(address && {
          address,
        }),
        ...(city && {
          city,
        }),
        ...(state && {
          state,
        }),
        ...(zip && {
          zip,
        }),
        ...(country && {
          country,
        }),
        ...(companyName && {
          company_name: companyName,
        }),
        ...(birthDate && {
          birthdate: birthDate,
        }),
      };
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        data,
      });
    },
    async createCampaign(opts = {}) {
      const data = {};
      return this._makeRequest({
        method: "POST",
        path: "/campaigns",
        data,
      });
    },
    async addContactToCampaign(opts = {}) {
      const {
        campaignId, contactId,
      } = opts;
      return this._makeRequest({
        method: "POST",
        path: `/campaigns/${campaignId}/add_contact`,
        data: {
          contact_id: contactId,
        },
      });
    },
    async createTask(opts = {}) {
      const {
        contactId,
        task,
        taskTypeId,
        date,
        time,
        duration,
        note,
      } = opts;
      const data = {
        contact_id: contactId,
        task,
        task_type_id: taskTypeId,
        ...(date && {
          date,
        }),
        ...(time && {
          time,
        }),
        ...(duration && {
          duration,
        }),
        ...(note && {
          note,
        }),
      };
      return this._makeRequest({
        method: "POST",
        path: "/tasks",
        data,
      });
    },
  },
};
