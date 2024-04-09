import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendsms",
  propDefinitions: {
    groupId: {
      type: "integer",
      label: "Group ID",
      description: "The ID of the group to add the contact to.",
      async options({ page }) {
        const { details } = await this.listGroups({
          params: {
            page,
          },
        });

        return details.map(({
          id, name: label,
        }) => ({
          label,
          value: parseInt(id),
        }));
      },
    },
    reportMask: {
      type: "integer",
      label: "Report Mask",
      description: "Reporting options for delivery status.",
      options: [
        {
          label: "Delivered",
          value: 1,
        },
        {
          label: "Undelivered",
          value: 2,
        },
        {
          label: "Queued at network",
          value: 4,
        },
        {
          label: "Sent to network",
          value: 8,
        },
        {
          label: "Failed at network",
          value: 16,
        },
      ],
    },
    report_url: {
      type: "string",
      label: "Report URL",
      description: "The URL to send delivery reports to.",
    },
    charset: {
      type: "string",
      label: "Charset",
      description: "Character encoding for the text message.",
      default: "UTF-8",
    },
    data_coding: {
      type: "string",
      label: "Data Coding",
      description: "The encoding scheme of the message text.",
    },
    message_class: {
      type: "string",
      label: "Message Class",
      description: "Class of the SMS message.",
    },
    auto_detect_encoding: {
      type: "integer",
      label: "Auto Detect Encoding",
      description: "Automatically detect text encoding.",
    },
    short: {
      type: "boolean",
      label: "Short",
      description: "Use short encoding if possible.",
    },
    ctype: {
      type: "integer",
      label: "CType",
      description: "Type of the content.",
      default: 1,
    },
    to: {
      type: "string",
      label: "To",
      description: "The phone number to send the SMS to, in E.164 format without the + sign (e.g., 40727363767).",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text message to send.",
    },
    from: {
      type: "string",
      label: "From",
      description: "The sender ID that appears on the recipient's device.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.sendsms.ro/json";
    },
    _params(params) {
      return {
        ...params,
        username: `${this.$auth.username}`,
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, params, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl(),
        params: this._params(params),
      });
    },
    listGroups({
      params, ...opts
    }) {
      return this._makeRequest({
        params: {
          ...params,
          action: "address_book_groups_get_list",
        },
        ...opts,
      });
    },
    sendSms({
      params, ...opts
    }) {
      return this._makeRequest({
        params: {
          action: "message_send",
          ...params,
        },
        ...opts,
      });
    },
    sendSmsGDPR({
      params, ...opts
    }) {
      return this._makeRequest({
        params: {
          action: "message_send_gdpr",
          ...params,
        },
        ...opts,
      });
    },
    checkBlocklist({
      params, ...opts
    }) {
      return this._makeRequest({
        params: {
          action: "blocklist_check",
          ...params,
        },
        ...opts,
      });
    },
    addContact({
      params, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        params: {
          action: "address_book_contact_add",
          ...params,
        },
        ...opts,
      });
    },
  },
};
