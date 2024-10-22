import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "smstools",
  propDefinitions: {
    inboundMessage: {
      type: "string",
      label: "Inbound Message",
      description: "Emits new event when a new inbound message is received.",
      async options() {
        const messages = await this.getInboxMessages();
        return messages.map((msg) => ({
          label: msg.message,
          value: msg.ID,
        }));
      },
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact.",
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The group ID where the contact should be added.",
      async options() {
        const groups = await this.getGroups();
        return groups.map((group) => ({
          label: group.name,
          value: group.id,
        }));
      },
    },
    contact: {
      type: "string",
      label: "Contact",
      description: "Select a contact to add to the opt-out list.",
      async options() {
        const contacts = await this.getContacts();
        return contacts.map((contact) => ({
          label: contact.name,
          value: contact.id,
        }));
      },
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to be sent.",
    },
    to: {
      type: "string",
      label: "Recipient",
      description: "The contact to send the message to.",
      async options() {
        const contacts = await this.getContacts();
        return contacts.map((contact) => ({
          label: contact.name,
          value: contact.phone,
        }));
      },
    },
    sender: {
      type: "string",
      label: "Sender",
      description: "The sender ID for the message.",
      async options() {
        const senders = await this.getSenderIds();
        return senders.map((sender) => ({
          label: sender.name,
          value: sender.id,
        }));
      },
    },
    subId: {
      type: "string",
      label: "Sub ID",
      description: "Subaccount ID from which the message is sent.",
      async options() {
        const subaccounts = await this.getSubAccounts();
        return subaccounts.map((subaccount) => ({
          label: subaccount.name,
          value: subaccount.id,
        }));
      },
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact.",
      optional: true,
    },
    birthday: {
      type: "string",
      label: "Birthday",
      description: "Birthday of the contact.",
      optional: true,
    },
    extra1: {
      type: "string",
      label: "Extra 1",
      description: "Extra field 1 for the contact.",
      optional: true,
    },
    extra2: {
      type: "string",
      label: "Extra 2",
      description: "Extra field 2 for the contact.",
      optional: true,
    },
    extra3: {
      type: "string",
      label: "Extra 3",
      description: "Extra field 3 for the contact.",
      optional: true,
    },
    extra4: {
      type: "string",
      label: "Extra 4",
      description: "Extra field 4 for the contact.",
      optional: true,
    },
    extra5: {
      type: "string",
      label: "Extra 5",
      description: "Extra field 5 for the contact.",
      optional: true,
    },
    extra6: {
      type: "string",
      label: "Extra 6",
      description: "Extra field 6 for the contact.",
      optional: true,
    },
    extra7: {
      type: "string",
      label: "Extra 7",
      description: "Extra field 7 for the contact.",
      optional: true,
    },
    extra8: {
      type: "string",
      label: "Extra 8",
      description: "Extra field 8 for the contact.",
      optional: true,
    },
    unsubscribed: {
      type: "boolean",
      label: "Unsubscribed",
      description: "Indicates if the contact is unsubscribed.",
      optional: true,
    },
    date: {
      type: "string",
      label: "Scheduled Date",
      description: "The date to send the message.",
      optional: true,
    },
    reference: {
      type: "string",
      label: "Reference",
      description: "Reference for the message.",
      optional: true,
    },
    test: {
      type: "boolean",
      label: "Test",
      description: "Test mode for the message.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.smsgatewayapi.com/v1";
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
          "X-Client-Id": this.$auth.client_id,
          "X-Client-Secret": this.$auth.client_secret,
          "Content-Type": "application/json",
        },
      });
    },
    async getInboxMessages(opts = {}) {
      return this._makeRequest({
        path: "/message/inbox",
        ...opts,
      });
    },
    async getContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    async getGroups(opts = {}) {
      return this._makeRequest({
        path: "/groups",
        ...opts,
      });
    },
    async getSenderIds(opts = {}) {
      return this._makeRequest({
        path: "/senderids",
        ...opts,
      });
    },
    async getSubAccounts(opts = {}) {
      return this._makeRequest({
        path: "/subaccounts",
        ...opts,
      });
    },
    async addContactToGroup({
      phone, groupId, ...otherData
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/contact",
        data: {
          phone,
          groupid: groupId,
          ...otherData,
        },
      });
    },
    async addOptOut(data = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/optout",
        data,
      });
    },
    async sendMessage({
      message, to, sender, date, reference, test, subId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/message/send",
        data: {
          message,
          to,
          sender,
          date,
          reference,
          test,
          subid: subId,
        },
      });
    },
  },
};
