const gitlab = require("https://github.com/PipedreamHQ/pipedream/components/gitlab/gitlab.app.js");

module.exports = {
  name: "New Branch (Instant)",
  description: "Emits an event when a new branch is created",
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
        push_events: true,
        url: this.http.endpoint,
      };
      const opts = {
        hookParams,
        projectId: this.projectId,
      };
      const { hookId, token } = await this.gitlab.createHook(opts);
      console.log(
        `Created "push events" webhook for project ID ${this.projectId}.
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
    isNewBranch(body) {
      // Logic based on https://gitlab.com/gitlab-org/gitlab-foss/-/issues/31723.
      const { before } = body;
      const expectedBeforeValue = "0000000000000000000000000000000000000000";
      return before === expectedBeforeValue;
    },
    generateMeta(data) {
      const newBranchName = data.ref;
      const summary = `New Branch: ${newBranchName}`;
      const ts = +new Date();
      return {
        id: newBranchName,
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

    // Gitlab doesn't offer a specific hook for "new branch" events,
    // but such event can be deduced from the payload of "push" events.
    if (this.isNewBranch(body)) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
