const gitlab = require("https://github.com/PipedreamHQ/pipedream/components/gitlab/gitlab.app.js");

module.exports = {
  name: "New Review Request (Instant)",
  description: "Emits an event when a reviewer is added to a merge request",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    gitlab,
    projectId: { propDefinition: [gitlab, "projectId"] },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const hookParams = {
        merge_requests_events: true,
        push_events: false,
        url: this.http.endpoint,
      };
      const opts = {
        hookParams,
        projectId: this.projectId,
      };
      const { hookId, token } = await this.gitlab.createHook(opts);
      console.log(
        `Created "merge request events" webhook for project ID ${this.projectId}.
        (Hook ID: ${hookId}, endpoint: ${hookParams.url})`
      );
      this.db.set("hookId", hookId);
      this.db.set("token", token);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const opts = {
        hookId,
        projectId: this.projectId,
      };
      await this.gitlab.deleteHook(opts);
      console.log(
        `Deleted webhook for project ID ${this.projectId}.
        (Hook ID: ${hookId})`
      );
    },
  },
  methods: {
    getNewReviewers(body) {
      const { action, title } = body.object_attributes;

      // When a merge request is first created, any assignees
      // in it are interpreted as new review requests.
      if (action === "open" || action === "reopen") {
        const { assignees = [] } = body;
        return assignees;
      }

      // Gitlab API provides any merge request update diff
      // as part of their response. We can check the presence of
      // the `assignees` attribute within those changes to verify
      // if there are new review requests.
      const { assignees } = body.changes;
      if (!assignees) {
        console.log(`No new assignees in merge request "${title}"`);
        return [];
      }

      // If the assignees of the merge request changed, we need to compute
      // the difference in order to extract the new reviewers.
      const previousAssigneesUsernames = new Set(assignees.previous.map(a => a.username));
      const newAssignees = assignees.current.filter(a => !previousAssigneesUsernames.has(a.username));
      if (newAssignees.length > 0) {
        console.log(
          `Assignees added to merge request "${title}": ${newAssignees.map(a => a.username).join(', ')}`
        );
      }
      return newAssignees;
    },
    generateMeta(data, reviewer) {
      const {
        id,
        title,
        updated_at
      } = data.object_attributes;
      const summary = `New reviewer for "${title}": ${reviewer.username}`;
      const ts = +new Date(updated_at);
      const compositeId = `${id}-${ts}-${reviewer.username}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const { headers, body } = event;

    // Reject any calls not made by the proper Gitlab webhook.
    if (!this.gitlab.isValidSource(headers, this.db)) {
      this.http.respond({
        status: 404,
      });
      return;
    }

    // Acknowledge the event back to Gitlab.
    this.http.respond({
      status: 200,
    });

    // Gitlab doesn't offer a specific hook for "new merge request reviewers" events,
    // but such event can be deduced from the payload of "merge request" events.
    this.getNewReviewers(body).forEach(reviewer => {
      const meta = this.generateMeta(body, reviewer);
      const event = {
        ...body,
        reviewer,
      };
      this.$emit(event, meta);
    });
  },
};
