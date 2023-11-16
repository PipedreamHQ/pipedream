import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sms_alert",
  propDefinitions: {
    apiKey: {
      type: "string",
      label: "API Key",
      description: "The API Key generated from your SMS Alert account.",
    },
    groupId: {
      type: "string",
      label: "Group ID",
      description: "The ID of the group.",
      async options({ prevContext }) {
        const { page } = prevContext || {
          page: 1,
        };
        const groups = await this.getGroupList({
          page,
        });
        return groups.map((group) => ({
          label: group.Group.name,
          value: group.Group.id,
        }));
      },
    },
    senderId: {
      type: "string",
      label: "Sender ID",
      description: "The Sender ID assigned to your account.",
    },
    mobileNumber: {
      type: "string",
      label: "Mobile Number",
      description: "The mobile number to which the SMS is to be sent.",
    },
    messageText: {
      type: "string",
      label: "Message Text",
      description: "The message to be sent.",
    },
    scheduleTime: {
      type: "string",
      label: "Schedule Time",
      description: "The date and time for the schedule (Format: YYYY-MM-DD HH:MM:SS).",
      optional: true,
    },
    contactName: {
      type: "string",
      label: "Contact Name",
      description: "The name of the contact.",
      optional: true,
    },
    groupName: {
      type: "string",
      label: "Group Name",
      description: "The name of the group to create a contact in.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.smsalert.co.in/api";
    },
    async _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
      });
    },
    async getGroupList({ page = 1 }) {
      return this._makeRequest({
        path: `/grouplist.json?page=${page}`,
      });
    },
    async createGroup({ name }) {
      return this._makeRequest({
        method: "POST",
        path: `/creategroup.json?name=${name}`,
      });
    },
    async sendGroupSMS({
      groupId, senderId, messageText, scheduleTime,
    }) {
      const path = `/grouppush.json?id=${groupId}&sender=${senderId}&text=${encodeURIComponent(messageText)}${scheduleTime
        ? `&schedule=${encodeURIComponent(scheduleTime)}`
        : ""}`;
      return this._makeRequest({
        method: "POST",
        path,
      });
    },
    async createContact({
      groupName, contactName, mobileNumber,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/createcontact.json?grpname=${groupName}&name=${contactName}&number=${mobileNumber}`,
      });
    },
    async sendSMS({
      senderId, mobileNumber, messageText,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/push.json?sender=${senderId}&mobileno=${mobileNumber}&text=${encodeURIComponent(messageText)}`,
      });
    },
    async scheduleSMS({
      senderId, mobileNumber, messageText, scheduleTime,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/push.json?sender=${senderId}&mobileno=${mobileNumber}&text=${encodeURIComponent(messageText)}&schedule=${encodeURIComponent(scheduleTime)}`,
      });
    },
  },
};
