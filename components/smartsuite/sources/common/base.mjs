import smartsuite from "../../smartsuite.app.mjs";

export default {
  props: {
    smartsuite,
    db: "$.service.db",
    http: "$.interface.http",
    timer: {
      label: "Webhook renewal schedule",
      description: "The SmartSuite API requires occasional renewal of webhooks. **This runs in the background, so you should not need to modify this schedule**.",
      type: "$.interface.timer",
      static: {
        intervalSeconds: 24 * 60 * 60, // once per day
      },
    },
    solutionId: {
      propDefinition: [
        smartsuite,
        "solutionId",
      ],
    },
  },
  hooks: {
    async activate() {
      const { webhook: { webhook_id: hookId } } = await this.smartsuite.createWebhook({
        data: {
          webhook: {
            filter: {
              solution: {},
            },
            kinds: [
              this.getEventType(),
            ],
            locator: {
              account_id: this.smartsuite.$auth.account_id,
              solution_id: this.solutionId,
            },
            notification_status: {
              enabled: {
                url: this.http.endpoint,
              },
            },
          },
        },
      });
      this._setHookId(hookId);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (hookId) {
        await this.smartsuite.deleteWebhook({
          data: {
            webhook_id: hookId,
          },
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    _getPageToken() {
      return this.db.get("pageToken");
    },
    _setPageToken(pageToken) {
      this.db.set("pageToken", pageToken);
    },
    generateMeta(event) {
      return {
        id: event.event_id,
        summary: this.getSummary(event),
        ts: Date.parse(event.event_at),
      };
    },
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run() {
    const hookId = this._getHookId();
    const pageToken = this._getPageToken();

    const {
      events, next_page_token: nextPageToken,
    } = await this.smartsuite.listWebhookEvents({
      data: {
        webhook_id: hookId,
        page_token: pageToken,
      },
    });

    this._setPageToken(nextPageToken);

    if (!events?.length) {
      return;
    }

    events.forEach((event) => {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    });
  },
};
