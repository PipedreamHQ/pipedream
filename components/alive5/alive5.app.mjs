import { axios } from "@pipedream/platform";

const RELAY_BASE_URL = "https://alive5-connectors-relay.raghav-ojha-14122.workers.dev";

const SAFE_ERROR_MESSAGES = {
  "Invalid token": "The Alive5 API key is invalid. Reconnect your account.",
  "Could not create subscription": "Alive5 could not create the webhook subscription. Check your API key and that the selected line is still active.",
  "Could not delete subscription": "Alive5 could not delete the webhook subscription. Retry cleanup before discarding the source.",
  "Subscription not found; retry after propagation or reconcile": "The Alive5 webhook subscription was not found. Retry after propagation, or reconcile the subscription manually.",
};

function safeErrorDetail(raw) {
  if (raw == null) return null;
  const candidates = [
    raw?.error?.message,
    raw?.error,
    raw?.data?.error?.message,
    raw?.data?.error,
  ];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const key = candidate.trim();
    if (Object.prototype.hasOwnProperty.call(SAFE_ERROR_MESSAGES, key)) {
      return SAFE_ERROR_MESSAGES[key];
    }
  }
  return null;
}

export default {
  type: "app",
  app: "alive5",
  propDefinitions: {
    smsLine: {
      type: "string",
      label: "SMS Number",
      description: "The Alive5 business number to use.",
      async options() {
        const channels = await this.listChannels();
        return channels
          .filter((channel) => /^\+[1-9]\d{7,14}$/.test(channel.channel_label))
          .map((channel) => ({
            label: channel.channel_label,
            value: `${channel.channel_id}|${channel.channel_label}`,
          }));
      },
    },
    userId: {
      type: "string",
      label: "Sending User",
      description: "An Alive5 user assigned to the selected SMS channel.",
      async options({ smsLine }) {
        if (!smsLine) {
          return [];
        }
        const channelId = smsLine.split("|")[0];
        const channels = await this.listChannels();
        const selectedChannel = channels.find(
          ({ channel_id }) => `${channel_id}` === channelId,
        );
        const seenUserIds = new Set();
        const options = [];
        for (const agent of selectedChannel?.agents || []) {
          if (!agent.screen_name || !agent.user_id) {
            continue;
          }
          if (seenUserIds.has(agent.user_id)) {
            continue;
          }
          seenUserIds.add(agent.user_id);
          options.push({
            label: agent.screen_name,
            value: agent.user_id,
          });
        }
        return options;
      },
    },
    to: {
      type: "string",
      label: "Recipient Phone Number",
      description: "The recipient's phone number in E.164 format, such as +14155550123",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The SMS text to send",
    },
  },
  methods: {
    async _request({
      $, relay = false, ...options
    } = {}) {
      let response;
      try {
        response = await axios($, {
          baseURL: relay
            ? RELAY_BASE_URL
            : "https://api.alive5.com/public/1.0",
          headers: {
            "X-A5-APIKEY": this.$auth.api_key,
          },
          ...options,
          maxRedirects: 0,
        });
      } catch (error) {
        const status = Number(error.response?.status);
        const httpStatus = Number.isInteger(status) && status >= 100 && status <= 599
          ? status
          : "network error";
        const detail = safeErrorDetail(error.response?.data);
        throw new Error(`Alive5 HTTP request failed (${httpStatus}).${detail
          ? ` ${detail}`
          : ""}`);
      }
      if (relay) return response;
      const nonempty = (value) => value && (typeof value !== "object" || Object.keys(value).length > 0);
      const code = Number(response?.code);
      if (!Number.isFinite(code) || code < 200 || code >= 400 || nonempty(response?.error)
          || Number(response?.data?.code) >= 400
          || nonempty(response?.data?.error) || nonempty(response?.data?.errors)) {
        const errorCode = Number(response?.data?.code || response?.code);
        const shownCode = Number.isInteger(errorCode) && errorCode >= 100 && errorCode <= 599
          ? errorCode
          : "unknown";
        const detail = safeErrorDetail(response) || "Check your API key and input values.";
        throw new Error(`Alive5 rejected the request (code ${shownCode}). ${detail}`);
      }
      return response.data;
    },
    async listChannels(opts = {}) {
      const data = await this._request({
        ...opts,
        url: "/objects/channels-and-users/list",
      });
      return data?.Items || [];
    },
    async sendSms(opts = {}) {
      const result = await this._request({
        ...opts,
        url: "/conversations/sms/send",
        method: "POST",
      });
      const message = result?.data;
      if (!message?.message_id) throw new Error("Alive5 did not return a message ID. Check conversation history before retrying.");
      return Object.fromEntries([
        "message_id",
        "message_status",
        "thread_id",
        "From",
        "To",
        "direction",
        "message_content",
      ].map((key) => [
        key,
        message[key],
      ]));
    },
    async createSubscription({
      phoneNumber, url,
    }) {
      const result = await this._request({
        relay: true,
        url: "/subscriptions",
        method: "POST",
        data: {
          target: url,
          phoneNumber,
        },
      });
      if (typeof result?.id !== "string" || !result.id
          || result.phoneNumber !== phoneNumber
          || typeof result?.deliveryToken !== "string" || !result.deliveryToken) {
        throw new Error("Alive5 relay did not confirm the subscription. Check your account before retrying.");
      }
      return {
        id: result.id,
        phoneNumber: result.phoneNumber,
        deliveryToken: result.deliveryToken,
      };
    },
    async deleteSubscription({ id }) {
      if (typeof id !== "string" || !id) throw new Error("An Alive5 relay subscription ID is required for cleanup.");
      const result = await this._request({
        relay: true,
        url: `/subscriptions/${encodeURIComponent(id)}`,
        method: "DELETE",
      });
      if (result?.ok !== true) throw new Error("Alive5 relay did not confirm subscription cleanup. Retry deactivation.");
      return result;
    },
  },
};
