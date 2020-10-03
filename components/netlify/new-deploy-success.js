const netlify = require("https://github.com/PipedreamHQ/pipedream/components/netlify/netlify.app.js");

module.exports = {
  name: "New Deploy Success (Instant)",
  description: "Emits an event when a new deployment is completed",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    netlify,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    siteId: { propDefinition: [netlify, "siteId"] },
  },
  hooks: {
    async activate() {
      const opts = {
        event: "deploy_created",
        url: this.http.endpoint,
        siteId: this.siteId,
      };
      const { hookId, token } = await this.netlify.createHook(opts);
      this.db.set("hookId", hookId);
      this.db.set("token", token);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      const opts = {
        hookId,
        siteId: this.siteId,
      };
      await this.netlify.deleteHook(opts);
    },
  },
  methods: {
    generateMeta(data) {
      const { id, created_at, commit_ref } = data;
      const ts = +new Date(created_at);
      const summary = `Deploy succeeded for commit ${commit_ref}`;
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run(event) {
    const { headers, body, bodyRaw } = event;

    // Reject any calls not made by the proper Netlify webhook.
    if (!this.netlify.isValidSource(headers, bodyRaw, this.db)) {
      this.http.respond({
        status: 404,
      });
      return;
    }

    // Acknowledge the event back to Netlify.
    this.http.respond({
      status: 200,
    });

    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
