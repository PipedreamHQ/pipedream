import wisepops from "../../wisepops.app.mjs";
import { forgeToken } from "../common/utils.mjs";

export default {
  props: {
    wisepops,
    db: "$.service.db",
    http: "$.interface.http",
    wisepopId: {
      propDefinition: [
        wisepops,
        "wisepopId",
      ],
    },
  },
  hooks: {
    async activate() {
      throw new Error("activate() hook not implemented");
    },
    async deactivate() {
      const hookId = this.getHookId();
      await this.wisepops.deleteHook({
        hook_id: hookId,
      });
    },
  },
  methods: {
    getHookId() {
      return this.db.get("hookId");
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    async activateHook(eventType) {
      const url = this.http.endpoint;
      const { id } = await this.wisepops.createHook({
        target_url: url,
        event: eventType,
        wisepop_id: this.wisepopId,
      });
      this.setHookId(id);
    },
    emitEvent(events) {
      events.forEach((event) => {
        const {
          wisepop_id, collected_at,
        } = event;
        this.$emit(event, {
          id: wisepop_id + collected_at,
          summary: this.getSummary(event),
          ts: new Date(collected_at).getTime(),
        });
      });
    },
  },
  async run(event) {
    const token = this.wisepops.accessToken();
    const { body } = event;
    if (forgeToken(event, token)) {
      await this.emitEvent(body);
    }
  },
};
