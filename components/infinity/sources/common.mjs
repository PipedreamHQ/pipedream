import infinity from "../infinity.app.mjs";

export default {
  props: {
    infinity,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
    workspaceId: {
      propDefinition: [
        infinity,
        "workspaceId",
      ],
    },
    boardId: {
      propDefinition: [
        infinity,
        "boardId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
  },
  methods: {
    setHookId(webhookId) {
      this.db.set("hookId", webhookId);
    },
    getHookId() {
      return this.db.get("hookId");
    },
    getMetadata() {
      throw new Error("getMetadata Not implemented");
    },
    getEvent() {
      throw new Error("getEvent Not implemented");
    },
  },
  hooks: {
    async activate() {
      const {
        workspaceId,
        boardId,
        http,
      } = this;

      const { id } = await this.infinity.createHook({
        workspaceId,
        boardId,
        data: {
          url: http.endpoint,
          events: this.getEvent(),
        },
      });

      this.setHookId(id);
    },
    async deactivate() {
      const {
        workspaceId,
        boardId,
      } = this;
      await this.infinity.deleteHook({
        workspaceId,
        boardId,
        hookId: this.getHookId(),
      });
    },
  },
  async run({ body }) {
    const { payload } = body;

    this.$emit(body, this.getMetadata(payload));
  },
};
