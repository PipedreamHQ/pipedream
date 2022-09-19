import base from "../common/base.mjs";
import { eventTypes } from "../common/hook-events.mjs";

export default {
  ...base,
  key: "gitlab-new-issue",
  name: "New Issue (Instant)",
  description: "Emit new event when an issue is created in a project",
  version: "0.1.0",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook(eventTypes.ISSUES_EVENTS);
    },
  },
  methods: {
    ...base.methods,
    isNewIssue(issue) {
      const { previous } = issue.changes.updated_at;
      return previous === undefined || previous === null;
    },
    generateMeta({
      user, issue,
    }) {
      const {
        name,
        username,
      } = user;
      const {
        id,
        iid,
        created_at: createdAt,
        title,
      } = issue;
      return {
        id,
        summary: `New issue by ${name} (${username}): #${iid} ${title}`,
        ts: +new Date(createdAt),
      };
    },
    async emitEvent(event) {
      // Gitlab doesn't offer a specific hook for "new issue" events,
      // but such event can be deduced from the payload of "issues" events.
      if (this.isNewIssue(event)) {
        const meta = this.generateMeta({
          user: event.user,
          issue: event.object_attributes,
        });
        this.$emit(event, meta);
      }
    },
  },
};
