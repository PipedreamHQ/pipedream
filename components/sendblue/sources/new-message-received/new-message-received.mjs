import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import app from "../../sendblue.app.mjs";

export default {
  key: "sendblue-new-message-received",
  name: "New Message Received",
  description: "Emit new event when a new inbound message is received. [See the documentation](https://docs.sendblue.com/api/resources/messages/methods/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    accountEmail: {
      propDefinition: [
        app,
        "accountEmail",
      ],
    },
    fromNumberFilter: {
      propDefinition: [
        app,
        "fromNumberFilter",
      ],
    },
    toNumberFilter: {
      propDefinition: [
        app,
        "toNumberFilter",
      ],
    },
    groupIdFilter: {
      propDefinition: [
        app,
        "groupIdFilter",
      ],
    },
    messageTypeFilter: {
      propDefinition: [
        app,
        "messageTypeFilter",
      ],
    },
    serviceFilter: {
      propDefinition: [
        app,
        "serviceFilter",
      ],
    },
    statusFilter: {
      propDefinition: [
        app,
        "statusFilter",
      ],
    },
    orderBy: {
      propDefinition: [
        app,
        "orderBy",
      ],
    },
    orderDirection: {
      propDefinition: [
        app,
        "orderDirection",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
      this._setIsFirstRun(false);
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
    _getIsFirstRun() {
      return this.db.get("isFirstRun") !== false;
    },
    _setIsFirstRun(value) {
      this.db.set("isFirstRun", value);
    },
    async processEvent(max) {
      const lastTimestamp = this._getLastTimestamp();

      // Build query params from user-selected filters
      const params = {
        is_outbound: false,
        limit: this.limit || 50,
      };

      if (this.accountEmail) {
        params.account_email = this.accountEmail;
      }

      if (this.fromNumberFilter) {
        params.from_number = this.fromNumberFilter;
      }

      if (this.toNumberFilter) {
        params.to_number = this.toNumberFilter;
      }

      if (this.groupIdFilter) {
        params.group_id = this.groupIdFilter;
      }

      if (this.messageTypeFilter) {
        params.message_type = this.messageTypeFilter;
      }

      if (this.serviceFilter) {
        params.service = this.serviceFilter;
      }

      if (this.statusFilter) {
        params.status = this.statusFilter;
      }

      if (this.orderBy) {
        params.order_by = this.orderBy;
      }

      if (this.orderDirection) {
        params.order_direction = this.orderDirection;
      }

      const response = await this.app.listMessages({
        params,
      });

      const messages = response.data || [];

      if (!messages.length) {
        return;
      }

      // Filter for messages newer than the last timestamp
      // Use date_updated as the reliable timestamp field
      const newMessages = messages.filter((message) => {
        const dateToUse = message.date_updated || message.date_sent;
        const messageTime = new Date(dateToUse).getTime();
        return messageTime > lastTimestamp;
      }).slice(0, max);

      if (newMessages.length > 0) {
        // Update the last timestamp to the most recent message
        const mostRecentTime = Math.max(...newMessages.map((m) => {
          const dateToUse = m.date_updated || m.date_sent;
          return new Date(dateToUse).getTime();
        }));
        this._setLastTimestamp(mostRecentTime);
      }

      newMessages.forEach((message) => {
        const meta = this.generateMeta(message);
        this.$emit(message, meta);
      });
    },
    generateMeta(message) {
      const dateToUse = message.date_updated || message.date_sent;
      return {
        id: message.message_handle,
        summary: `New message from ${message.from_number}`,
        ts: new Date(dateToUse).getTime(),
      };
    },
  },
  async run() {
    // Skip first run since deploy hook already executed processEvent
    if (this._getIsFirstRun()) {
      this._setIsFirstRun(false);
      return;
    }
    await this.processEvent();
  },
};
