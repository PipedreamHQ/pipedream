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
      const passcode = uuid();
      this.setPasscode(passcode);

      const hookId = await this.figma.createHook(
        "FILE_COMMENT",
        this.teamId,
        this.http.endpoint,
        passcode,
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
    getPasscode() {
      return this.db.get("passcode");
    },
    setPasscode(passcode) {
      this.db.set("passcode", passcode);
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    if (event.body.passcode === this.getPasscode()) {
      this.$emit(event.body,  {
        summary: `New comment on a file (${event.body.comment_id})`,
        id: event.body.comment_id,
        ts: event.body.timestamp,
      });
    }
  },
};
