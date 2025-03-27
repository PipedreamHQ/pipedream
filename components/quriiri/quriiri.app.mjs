import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "quriiri",
  version: "0.0.{{ts}}",
  propDefinitions: {
    // Required props
    sender: {
      type: "string",
      label: "Sender",
      description: "The phone number or sender ID sending the SMS",
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "The recipient's phone number",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The message content",
    },
    // Optional props
    senderType: {
      type: "string",
      label: "Sender Type",
      description: "The type of sender",
      optional: true,
    },
    data: {
      type: "string",
      label: "Data",
      description: "Additional data",
      optional: true,
    },
    udh: {
      type: "string",
      label: "UDH",
      description: "User Data Header",
      optional: true,
    },
    batchId: {
      type: "string",
      label: "Batch ID",
      description: "Batch identifier",
      optional: true,
    },
    billingRef: {
      type: "string",
      label: "Billing Reference",
      description: "Billing reference",
      optional: true,
    },
    drUrl: {
      type: "string",
      label: "Delivery Receipt URL",
      description: "URL to receive delivery receipts",
      optional: true,
    },
    drType: {
      type: "string",
      label: "Delivery Receipt Type",
      description: "Type of delivery receipt",
      optional: true,
    },
    flash: {
      type: "boolean",
      label: "Flash",
      description: "Send as flash SMS",
      optional: true,
    },
    validity: {
      type: "integer",
      label: "Validity",
      description: "Validity period of the message in minutes",
      optional: true,
    },
    scheduleTime: {
      type: "string",
      label: "Schedule Time",
      description: "Time to schedule the message (ISO 8601 format)",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.quriiri.fi";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async sendSms(opts = {}) {
      const {
        sender,
        destination,
        text,
        senderType,
        data,
        udh,
        batchId,
        billingRef,
        drUrl,
        drType,
        flash,
        validity,
        scheduleTime,
      } = opts;

      const payload = {
        sender: sender,
        destination: destination,
        text: text,
      };

      if (senderType) payload.senderType = senderType;
      if (data) payload.data = data;
      if (udh) payload.udh = udh;
      if (batchId) payload.batchId = batchId;
      if (billingRef) payload.billingRef = billingRef;
      if (drUrl) payload.drUrl = drUrl;
      if (drType) payload.drType = drType;
      if (flash !== undefined) payload.flash = flash;
      if (validity !== undefined) payload.validity = validity;
      if (scheduleTime) payload.scheduleTime = scheduleTime;

      return this._makeRequest({
        method: "POST",
        path: "/send-sms",
        data: payload,
      });
    },
    async listIncomingMessages(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/messages/incoming",
        params: opts,
      });
    },
    async paginate(fn, ...opts) {
      const results = [];
      let more = true;
      let page = 1;

      while (more) {
        const response = await fn({
          ...opts,
          page,
        });
        if (response.length === 0) {
          more = false;
        } else {
          results.push(...response);
          page += 1;
        }
      }

      return results;
    },
  },
};
