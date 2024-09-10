import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agiliron",
  propDefinitions: {
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The last name of the contact or lead",
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the lead",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the event",
    },
    startdate: {
      type: "string",
      label: "Start Date",
      description: "The start date of the event (format: MM-DD-YYYY)",
    },
    starttime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the event (format: HH:MM:SS)",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.company}.agiliron.net/agiliron/api-40.php`;
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Accept: "application/json",
          apiKey: this.$auth.api_key,
        },
      });
    },
    async addContact(data) {
      return this._makeRequest({
        method: "POST",
        path: "/Contact",
        data: {
          Contacts: {
            Contact: [
              data,
            ],
          },
        },
      });
    },
    async addLead(data) {
      return this._makeRequest({
        method: "POST",
        path: "/Leads",
        data: {
          Leads: {
            Lead: [
              data,
            ],
          },
        },
      });
    },
    async addEvent(data) {
      return this._makeRequest({
        method: "POST",
        path: "/Event",
        data: {
          Events: {
            Event: [
              data,
            ],
          },
        },
      });
    },
    async getContacts(opts = {}) {
      return this._makeRequest({
        path: "/Contact",
        ...opts,
      });
    },
    async getLeads(opts = {}) {
      return this._makeRequest({
        path: "/Leads",
        ...opts,
      });
    },
    async getEvents(opts = {}) {
      return this._makeRequest({
        path: "/Event",
        ...opts,
      });
    },
    async emitNewContactEvents() {
      const contacts = await this.getContacts();
      for (const contact of contacts.Contacts.Contact) {
        this.$emit(contact, {
          id: contact.ContactId,
          summary: `New contact: ${contact.FirstName} ${contact.LastName}`,
          ts: new Date(contact.CreatedTimeUTC).getTime(),
        });
      }
    },
    async emitNewLeadEvents() {
      const leads = await this.getLeads();
      for (const lead of leads.Leads.Lead) {
        this.$emit(lead, {
          id: lead.LeadId,
          summary: `New lead: ${lead.FirstName} ${lead.LastName}`,
          ts: new Date(lead.CreatedTimeUTC).getTime(),
        });
      }
    },
    async emitNewTaskEvents() {
      const tasks = await this.getEvents();
      for (const task of tasks.Events.Event) {
        this.$emit(task, {
          id: task.EventId,
          summary: `New task: ${task.Subject}`,
          ts: new Date(task.CreatedTimeUTC).getTime(),
        });
      }
    },
  },
};
