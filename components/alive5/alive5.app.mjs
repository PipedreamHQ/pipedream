import { axios } from "@pipedream/platform";

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
      description: "The recipient's phone number, including country code",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The SMS text to send",
    },
  },
  methods: {
    async _request({
      $, ...options
    } = {}) {
      let response;
      try {
        response = await axios($, {
          baseURL: "https://api.alive5.com/public/1.0",
          headers: {
            "X-A5-APIKEY": this.$auth.api_key,
          },
          ...options,
        });
      } catch (error) {
        throw new Error(`Alive5 HTTP request failed (${error.response?.status || "network error"}).`);
      }
      const nonempty = (value) => value && (typeof value !== "object" || Object.keys(value).length > 0);
      const code = Number(response?.code);
      if (!Number.isFinite(code) || code < 200 || code >= 400 || nonempty(response?.error)
          || Number(response?.data?.code) >= 400
          || nonempty(response?.data?.error) || nonempty(response?.data?.errors)) {
        throw new Error(`Alive5 rejected the request (code ${response?.data?.code || response?.code || "unknown"}). Check your API key and input values.`);
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
    async listWebhooks(phone) {
      const result = await this._request({
        url: `/register/webhook/sms/${encodeURIComponent(phone)}`,
      });
      return result?.interceptors || [];
    },
    async registerWebhook({
      phoneNumber, url,
    }) {
      const result = await this._request({
        url: "/register/webhook/sms",
        method: "POST",
        data: {
          phoneNumber,
          url,
          direction: "inbound",
          method: "POST",
        },
      });
      const interceptors = result?.channelUpdate?.Attributes?.interceptor || [];
      const matching = interceptors.find(
        (interceptor) => interceptor.url === url,
      );
      if (!matching?.interceptorUuid) {
        throw new Error(
          `No interceptor with URL ${url} was returned by Alive5`,
        );
      }
      return matching.interceptorUuid;
    },
    async deleteWebhook({
      phoneNumber, interceptorUuid,
    }) {
      const result = await this._request({
        url: "/register/webhook/sms",
        method: "DELETE",
        data: {
          phoneNumber,
          interceptorUuid,
        },
      });
      return result;
    },
  },
};
