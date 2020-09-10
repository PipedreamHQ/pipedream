const gitlab = require("https://github.com/PipedreamHQ/pipedream/components/gitlab/gitlab.app.js");

module.exports = {
  name: "New Branch (Instant)",
  description: "Emits an event when a new branch is created",
  version: "0.0.1",
  props: {
    gitlab,
    projectId: { propDefinition: [gitlab, "projectId"] },
    http: "$.interface.http",
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
      const response = await this.gitlab.createHook(opts);

      const { hookId, token } = response;
      this.db.set("hookId", hookId);
      this.db.set("token", token);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const opts = {
        hookId,
        projectId: this.projectId,
      };
      this.gitlab.deleteHook(opts);
    },
  },
  methods: {
    isNewBranch(body) {
      // Logic based on https://gitlab.com/gitlab-org/gitlab-foss/-/issues/31723.
      const { before } = body;
      const expectedBeforeValue = "0000000000000000000000000000000000000000";
      return before === expectedBeforeValue;
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
      this.$emit(body);
    }
  },
};
