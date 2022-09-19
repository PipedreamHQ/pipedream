import base from "../common/base.mjs";
import { eventTypes } from "../common/hook-events.mjs";

export default {
  ...base,
  key: "gitlab-new-review-request",
  name: "New Review Request (Instant)",
  description: "Emit new event when a reviewer is added to a merge request",
  version: "0.1.0",
  dedupe: "unique",
  type: "source",
  hooks: {
    ...base.hooks,
    async activate() {
      await this.activateHook([
        eventTypes.MERGE_REQUESTS_EVENTS,
        eventTypes.PUSH_EVENT,
      ]);
    },
  },
  methods: {
    ...base.methods,
    getNewReviewers(event) {
      const {
        action,
        title,
      } = event.object_attributes;

      // When a merge request is first created, any assignees
      // in it are interpreted as new review requests.
      if (action === "open" || action === "reopen") {
        const { assignees = [] } = event;
        return assignees;
      }

      // Gitlab API provides any merge request update diff
      // as part of their response. We can check the presence of
      // the `assignees` attribute within those changes to verify
      // if there are new review requests.
      const { assignees } = event.changes;
      if (!assignees) {
        console.log(`No new assignees in merge request "${title}"`);
        return [];
      }

      // If the assignees of the merge request changed, we need to compute
      // the difference in order to extract the new reviewers.
      const previousAssignees = new Set(assignees.previous.map((a) => a.username));
      const newAssignees = assignees.current.filter((a) => !previousAssignees.has(a.username));
      if (newAssignees.length > 0) {
        console.log(`Assignees added to merge request "${title}": ${newAssignees.map((a) => a.username).join(", ")}`);
      }
      return newAssignees;
    },
    generateMeta(event, reviewer) {
      const {
        id,
        title,
        updated_at: updatedAt,
      } = event.object_attributes;
      const ts = +new Date(updatedAt);
      return {
        id: `${id}-${ts}-${reviewer.username}`,
        summary: `New reviewer for "${title}": ${reviewer.username}`,
        ts,
      };
    },
    async emitEvent(event) {
      // Gitlab doesn't offer a specific hook for "new merge request reviewers" events,
      // but such event can be deduced from the payload of "merge request" events.
      this.getNewReviewers(event).forEach((reviewer) => {
        const meta = this.generateMeta(event, reviewer);
        this.$emit({
          ...event,
          reviewer,
        }, meta);
      });
    },
  },
};
