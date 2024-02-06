import {
  axios,
  DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";

export default {
  key: "intercom-new-user-reply",
  name: "New Reply From User",
  description: "Emit new event each time a user replies to a conversation.",
  version: "0.0.3",
  type: "source",
  dedupe: "unique",
  props: {
    intercom: {
      type: "app",
      app: "intercom",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
      label: "Polling Interval",
      description: "Pipedream will poll the API on this schedule",
    },
  },
  methods: {
    monthAgo() {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return monthAgo;
    },
    async makeRequest(opts) {
      const {
        method,
        url,
        endpoint,
        data,
        $,
      } = opts;
      const config = {
        method,
        url: url ?? `https://api.intercom.io/${endpoint}`,
        headers: {
          Authorization: `Bearer ${this.intercom.$auth.oauth_access_token}`,
          Accept: "application/json",
        },
        data,
      };
      return axios($ || this, config);
    },
    async paginate(itemType, method, data, isSearch = false, lastCreatedAt) {
      let results = null;
      let done = false;
      let items = [];
      while ((!results || results?.pages?.next) && !done) {
        const startingAfter = results?.pages?.next?.starting_after || null;
        const search = isSearch && "/search" || "";
        const startingAfterParam = startingAfter && `?starting_after=${startingAfter}` || "";
        const endpoint = `${itemType}${search}${startingAfterParam}`;
        results = await this.makeRequest({
          method,
          endpoint,
          data,
        });
        if (lastCreatedAt) {
          for (const item of results.data) {
            if (item.created_at > lastCreatedAt)
              items.push(item);
            else
              done = true;
          }
        } else {
          items = items.concat(results.data);
          if (!startingAfter)
            done = true;
        }
      }
      return items;
    },
    async getConversation(id) {
      return this.makeRequest({
        method: "GET",
        endpoint: `conversations/${id}`,
      });
    },
    async searchConversations(data) {
      return this.paginate("conversations", "POST", data, true);
    },
    _getLastUpdate() {
      const monthAgo = this.monthAgo();
      return this.db.get("lastUpdate") || Math.floor(monthAgo / 1000);
    },
    _setLastUpdate(lastUpdate) {
      this.db.set("lastUpdate", lastUpdate);
    },
    generateMeta(conversation, conversationData, conversationBody, totalCount) {
      return {
        id: conversationData.conversation_parts.conversation_parts[totalCount - 1].id,
        summary: conversationBody,
        ts: conversation.statistics.last_admin_reply_at,
      };
    },
  },
  async run() {
    let lastContactReplyAt = this._getLastUpdate();
    const data = {
      query: {
        field: "statistics.last_contact_reply_at",
        operator: ">",
        value: lastContactReplyAt,
      },
    };

    const results = await this.searchConversations(data);
    for (const conversation of results) {
      if (conversation.statistics.last_contact_reply_at > lastContactReplyAt)
        lastContactReplyAt = conversation.statistics.last_contact_reply_at;
      const conversationData = (
        await this.getConversation(conversation.id)
      );
      const totalCount = conversationData.conversation_parts.total_count;
      const conversationBody =
        conversationData?.conversation_parts?.conversation_parts[totalCount - 1]?.body;
      if (totalCount > 0 && conversationBody) {
        // emit id & summary from last part/reply added
        const meta =
          this.generateMeta(conversation, conversationData, conversationBody, totalCount);
        this.$emit(conversationData, meta);
      }
    }

    this._setLastUpdate(lastContactReplyAt);
  },
};
