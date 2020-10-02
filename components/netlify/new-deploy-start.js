const axios = require("axios");
const crypto = require("crypto");
const jwt = require('jwt-simple');
const NetlifyAPI = require("netlify");
const parseLinkHeader = require('parse-link-header');
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
    async generateMeta(data) {
      const { id, build_id, created_at } = data;
      const ts = +new Date(created_at);

      const netlifyClient = this.netlify.createClient();
      // If the value of the commit SHA being built is `null`,
      // it means that the branch HEAD commit is the one being re-built.
      const sha = (await netlifyClient.getSiteBuild({ build_id }).sha) || "HEAD";
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

    const meta = await this.generateMeta(body);
    this.$emit(body, meta);
  },
};
