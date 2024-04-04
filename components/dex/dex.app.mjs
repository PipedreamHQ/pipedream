import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dex",
  propDefinitions: {
    time: {
      type: "string",
      label: "Reminder Time",
      description: "The time to set for the reminder",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The content of the reminder",
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the contact",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact",
    },
    address: {
      type: "string",
      label: "Address",
      description: "The address of the contact",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The company name of the contact",
      optional: true,
    },
    title: {
      type: "string",
      label: "Note Title",
      description: "The title of the note",
    },
    content: {
      type: "string",
      label: "Note Content",
      description: "The content of the note",
    },
    tags: {
      type: "string[]",
      label: "Note Tags",
      description: "The tags for categorizing the note",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getdex.com/api/rest";
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
    async createReminder({
      time, message,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/reminders",
        data: {
          reminder: {
            title: message,
            due_at_time: time,
          },
        },
      });
    },
    async createOrUpdateContact({
      name, email, phoneNumber, address, companyName,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: {
          contact: {
            first_name: name,
            contact_emails: {
              data: {
                email,
              },
            },
            contact_phone_numbers: {
              data: {
                phone_number: phoneNumber,
              },
            },
            address,
            company_name: companyName,
          },
        },
      });
    },
    async createNote({
      title, content, tags,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/timeline_items",
        data: {
          timeline_event: {
            note: content,
            event_time: new Date().toISOString(),
            meeting_type: "note",
          },
          title,
          tags,
        },
      });
    },
  },
};
