import base from "../common/base.mjs";
import { eventTypes } from "../common/hook-events.mjs";

export default {
  ...base,
  key: "gitlab-new-merge-request",
  name: "New Merge Request (Instant)",
  description: "Emit new event when a merge request is created",
  version: "0.1.0",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook(eventTypes.MERGE_REQUESTS_EVENTS);
    },
  },
  methods: {
    ...base.methods,
    isNewMergeRequest(event) {
      const { action } = event.object_attributes;
      const expectedAction = "open";
      return action === expectedAction;
    },
    generateMeta({
      user, mergeRequest,
    }) {
      const {
        name,
        username,
      } = user;
      const {
        id,
        created_at: createdAt,
        title,
      } = mergeRequest;
      return {
        id,
        summary: `New Merge Request: "${title}" by ${name} (${username})`,
        ts: +new Date(createdAt),
      };
    },
    async emitEvent(event) {
      // Gitlab doesn't offer a specific hook for "new merge request" events,
      // but such event can be deduced from the payload of "merge request" events.
      if (this.isNewMergeRequest(event)) {
        const meta = this.generateMeta({
          user: event.user,
          mergeRequest: event.object_attributes,
        });
        this.$emit(event, meta);
      }
    },
  },
};
