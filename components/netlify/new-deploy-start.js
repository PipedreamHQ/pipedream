const netlify = require("https://github.com/PipedreamHQ/pipedream/components/netlify/netlify.app.js");

module.exports = {
  name: "New Deploy Start (Instant)",
  description: "Emits an event when a new deployment is started",
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
        event: "deploy_building",
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
    async getSha(data) {
      const { build_id } = data;
      const netlifyClient = this.netlify.createClient();
      const { sha } = await netlifyClient.getSiteBuild({ build_id });

      // If the value of the commit SHA being built is `null`,
      // it means that the branch HEAD commit is being re-built.
      return sha !== null ? sha : "HEAD";
    },
    generateMeta(data) {
      const { id, created_at, sha } = data;
      const ts = +new Date(created_at);
      const summary = `Deploy started for commit ${sha}`;
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

    // Given that the event payload doesn't provide information
    // about the actual commit SHA being deployed, we need
    // to explicitly query it from the Netlify API.
    const sha = await this.getSha(body);
    const data = {
      ...body,
      sha,
    };
    const meta = this.generateMeta(data);
    this.$emit(data, meta);
  },
};
