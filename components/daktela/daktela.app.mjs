import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "daktela",
  propDefinitions: {
    user: {
      type: "string",
      label: "User",
      description: "The user associated with the account",
      async options({ page }) {
        const users = await this.getUsers({
          params: {
            take: LIMIT,
            skip: LIMIT * page,
          },
        });
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
    },
    survey: {
      type: "boolean",
      label: "Survey",
      description: "Indicate if a survey should be sent",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Unique identification for the account",
    },
    title: {
      type: "string",
      label: "Title",
      description: "Display name for the account",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Optional description for the account",
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
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number to Call",
      description: "The phone number to initiate the call",
    },
    callerNumber: {
      type: "string",
      label: "Caller's Number",
      description: "The number being used to make the call",
    },
    callingTime: {
      type: "string",
      label: "Calling Time",
      description: "Time to initiate the call",
    },
  },
  methods: {
    _baseUrl(version = "v5.0") {
      return `${this.$auth.instance_url}/api/${version}`;
    },
    _params(params = {}) {
      return {
        ...params,
        "Authorization": `Bearer ${this.$auth.access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, version, params, ...opts
    }) {
      const config = {
        url: this._baseUrl(version) + path,
        params: this._params(params),
        ...opts,
      };
      console.log("config: ", config);
      return axios($, config);
    },
    createAccount(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/accounts.json",
        ...opts,
      });
    },
    sendSms(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/sms_activities",
        ...opts,
      });
    },
    initiateCall(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/call_activities",
        ...opts,
      });
    },
    getUsers(opts = {}) {
      return this._makeRequest({
        path: "/users.json",
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
