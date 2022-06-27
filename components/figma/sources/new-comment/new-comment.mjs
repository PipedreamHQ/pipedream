import { v4 as uuid } from "uuid";
import figma from "../../figma.app.mjs";

export default {
  key: "figma-new-comment",
  name: "New Comment (Instant)",
  description: "Emit new event when someone comments on a file",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    figma,
    http: "$.interface.http",
    db: "$.service.db",
    teamId: {
      propDefinition: [
        figma,
        "teamId",
      ],
    },
  },
  hooks: {
    async activate() {
      const hookId = await this.figma.createHook(
        "FILE_COMMENT",
        this.teamId,
        this.http.endpoint,
        uuid(),
      );

      this.setHookId(hookId);
    },
    async deactivate() {
      await this.figma.deleteHook(this.getHookId());
    },
  },
  methods: {
    getHookId() {
      return this.db.get("hookId");
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    this.$emit(event,  {
      summary: "New comment on a file",
      id: event.body.comment_id,
      ts: event.body.timestamp,
    });
  },
};
