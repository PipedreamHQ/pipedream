import gitlab from "../../gitlab.app.mjs";
import base from "../common/base.mjs";
import { eventTypes } from "../common/hook-events.mjs";

export default {
  ...base,
  key: "gitlab-new-mention",
  name: "New Mention (Instant)",
  description: "Emit new event when you are @mentioned in a new commit, comment, issue or pull request",
  version: "0.1.0",
  dedupe: "unique",
  type: "source",
  props: {
    ...base.props,
    username: {
      propDefinition: [
        gitlab,
        "assignee",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "Username",
      description: "The GitLab Username whose mentions will emit events",
      withLabel: true,
    },
  },
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook([
        eventTypes.ISSUES_EVENTS,
        eventTypes.NOTE_EVENTS,
      ]);
    },
  },
  methods: {
    ...base.methods,
    isUserMentioned(mention) {
      const pattern = new RegExp(`\\B@${this.username.label}\\b`);
      const groomedAttributes = {
        ...mention,
        // We want to exclude some fields, since they do not map
        // to the content being updated, and could result in false
        // positives (e.g. if a URL contains `@someuser` in its path).
        url: "",
      };
      const changedSummary = JSON.stringify(groomedAttributes);
      return pattern.test(changedSummary);
    },
    generateMeta({
      user, mention,
    }) {
      const {
        id,
        created_at: createdAt,
      } = mention;
      const { username } = user;
      return {
        id,
        summary: `New mention of ${this.username.label} by ${username}`,
        ts: +new Date(createdAt),
      };
    },
    async emitEvent(event) {
      const {
        user,
        object_attributes: mention,
      } = event;
      // Gitlab doesn't offer a specific hook for "new label" events,
      // but such event can be deduced from the payload of "issues" events.
      if (this.isUserMentioned(mention)) {
        const meta = this.generateMeta({
          user,
          mention,
        });
        this.$emit(event, meta);
      }
    },
  },
};
