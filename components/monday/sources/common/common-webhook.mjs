import monday from "../../monday.app.mjs";

export default {
  props: {
    monday,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
  },
  hooks: {
    async activate() {
      const args = this.getWebhookArgs();
      const { data } = await this.monday.createWebhook({
        boardId: +this.boardId,
        url: this.http.endpoint,
        ...args,
      });
      const hookId = data?.create_webhook?.id;
      if (!hookId) {
        throw new Error (this.getWebhookCreationError());
      }
      this._setHookId(data.create_webhook.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      return this.monday.deleteWebhook({
        id: +hookId,
      });
    },
  },
  methods: {
    getWebhookCreationError() {
      return "Failed to establish webhook";
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getWebhookArgs() {
      throw new Error("getEventType is not implemented");
    },
    getSummary({ item }) {
      return item.name;
    },
    generateMeta({
      item, event,
    }) {
      return {
        id: `${item.id}_${item.updated_at || item.changedAt}`,
        summary: this.getSummary({
          item,
          event,
        }),
        ts: Date.parse(item.updated_at),
      };
    },
    async commonDeploy() {
      const { items } = (await this.monday.listItemsBoard({
        boardId: +this.boardId,
      })).data.boards[0];
      for (const item of items.slice(-25).reverse()) {
        const itemData = await this.monday.getItem({
          id: +item.id,
        });

        const meta = this.generateMeta({
          item,
        });
        this.$emit(itemData, meta);
      }
    },
  },
  async run(event) {
    const { body } = event;

    // verify the webhook
    if (body?.challenge) {
      return this.http.respond({
        status: 200,
        body,
      });
    }

    const itemId = body?.event?.pulseId;
    if (!itemId) {
      return;
    }

    const item = await this.monday.getItem({
      id: itemId,
    });

    const meta = this.generateMeta({
      item,
      event: body.event,
    });
    this.$emit({
      ...body,
      item,
    }, meta);
  },
};
