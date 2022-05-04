import base from "../common/base.mjs";
import { eventTypes } from "../common/hook-events.mjs";

export default {
  ...base,
  key: "gitlab-new-branch",
  name: "New Branch (Instant)",
  description: "Emit new event when a new branch is created",
  version: "0.1.0",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook(eventTypes.PUSH_EVENT);
    },
  },
  methods: {
    ...base.methods,
    isNewBranch(branch) {
      // Logic based on https://gitlab.com/gitlab-org/gitlab-foss/-/issues/31723.
      const { before } = branch;
      const expectedBeforeValue = "0000000000000000000000000000000000000000";
      return before === expectedBeforeValue;
    },
    generateMeta(branch) {
      const id = branch.ref;
      return {
        id,
        summary: `New Branch: ${id}`,
        ts: +new Date(),
      };
    },
    emitEvent(event) {
      // Gitlab doesn't offer a specific hook for "new branch" events,
      // but such event can be deduced from the payload of "push" events.
      if (this.isNewBranch(event)) {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      }
    },
  },
};
