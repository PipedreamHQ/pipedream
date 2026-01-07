import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "gosquared-new-user-exited-smart-group-instant",
  name: "New User Exited Smart Group (Instant)",
  description: "Emit new event when a user exits a smart group in GoSquared.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTrigger() {
      return "exited_smart_group";
    },
    generateMeta(body) {
      return {
        id: body.user_id,
        summary: `User ${body.person.id} exited smart group: ${body.group.name}`,
        ts: body.person.events.last,
      };
    },
  },
  sampleEmit,
};

