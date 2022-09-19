import base from "../common/base.mjs";
import { eventTypes } from "../common/hook-events.mjs";

export default {
  ...base,
  key: "gitlab-new-commit-comment",
  name: "New Commit Comment (Instant)",
  description: "Emit new event when a commit receives a comment",
  version: "0.1.0",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook(eventTypes.NOTE_EVENTS);
    },
  },
  methods: {
    ...base.methods,
    isCommentOnCommit(commit) {
      const noteableType = commit.object_attributes?.noteable_type;
      const expectedNoteableType = "Commit";
      return noteableType === expectedNoteableType;
    },
    generateMeta({
      user, comment,
    }) {
      const {
        name,
        username,
      } = user;
      const {
        id,
        created_at: createdAt,
        commit_id: commitId,
      } = comment;
      return {
        id,
        summary: `New comment by ${name} (${username}) on commit ${commitId}`,
        ts: +new Date(createdAt),
      };
    },
    async emitEvent(event) {
      // Gitlab doesn't offer a specific hook for "commit comments" events,
      // but such event can be deduced from the payload of "note" events.
      if (this.isCommentOnCommit(event)) {
        const meta = this.generateMeta({
          user: event.user,
          comment: event.object_attributes,
        });
        this.$emit(event, meta);
      }
    },
  },
};
