import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "daktela",
  propDefinitions: {
    user: {
      type: "string",
      label: "User",
      description: "The user associated with the account",
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    sla: {
      type: "integer",
      label: "SLA",
      description: "The SLA ID for the account",
      optional: true,
    },
    survey: {
      type: "boolean",
      label: "Survey",
      description: "Indicate if a survey should be sent",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Unique identification for the account",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Display name for the account",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description for the account",
      optional: true,
    },
    receiverNumber: {
      type: "string",
      label: "Receiver's Number",
      description: "The phone number to send the SMS to",
    },
    textContent: {
      type: "string",
      label: "Text Content",
      description: "The content of the SMS",
    },
    senderName: {
      type: "string",
      label: "Sender's Name",
      description: "Optional sender's name for the SMS",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number to Call",
      description: "The phone number to initiate the call",
    },
    callerNumber: {
      type: "string",
      label: "Caller’s Number",
      description: "The number being used to make the call",
      optional: true,
    },
    callingTime: {
      type: "string",
      label: "Calling Time",
      description: "Time to initiate the call",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://customer.daktela.com/api/v6";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.access_token}`,
        },
      });
    },
    async createAccount(params) {
      return this._makeRequest({
        method: "POST",
        path: "/accounts",
        data: params,
      });
    },
    async sendSms(params) {
      return this._makeRequest({
        method: "POST",
        path: "/sms_activities",
        data: params,
      });
    },
    async initiateCall(params) {
      return this._makeRequest({
        method: "POST",
        path: "/call_activities",
        data: params,
      });
    },
    async getUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    async emitNewAccountCreated() {
      const accounts = await this._makeRequest({
        path: "/accounts",
      });
      accounts.forEach((account) => {
        this.$emit(account, {
          summary: `New account created: ${account.title}`,
          id: account.account,
        });
      });
    },
    async emitTicketUpdated() {
      const tickets = await this._makeRequest({
        path: "/tickets",
      });
      tickets.forEach((ticket) => {
        this.$emit(ticket, {
          summary: `Ticket updated: ${ticket.title}`,
          id: ticket.ticket,
        });
      });
    },
    async emitNewContactAdded() {
      const contacts = await this._makeRequest({
        path: "/contacts",
      });
      contacts.forEach((contact) => {
        this.$emit(contact, {
          summary: `New contact added: ${contact.firstname} ${contact.lastname}`,
          id: contact.contact,
        });
      });
    },
  },
};
