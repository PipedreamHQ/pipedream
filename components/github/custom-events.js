const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");

module.exports = {
  name: "Custom Events",
  version: "0.0.1",
  props: {
    github,
    repoFullName: { propDefinition: [github, "repoFullName"] },
    events: { propDefinition: [github, "events"] },
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    generateSecret() {
      return "" + Math.random();
    },
  },
  hooks: {
    async activate() {
      const secret = this.generateSecret();
      const { id } = await this.github.createHook({
        repoFullName: this.repoFullName,
        endpoint: this.http.endpoint,
        events: this.events,
        secret,
      });
      this.db.set("hookId", id);
      this.db.set("secret", secret);
    },
    async deactivate() {
      await this.github.deleteHook({
        repoFullName: this.repoFullName,
        hookId: this.db.get("hookId"),
      });
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });
    const { body, headers } = event;
    if (headers["X-Hub-Signature"]) {
      const crypto = require("crypto");
      const algo = "sha1";
      const hmac = crypto.createHmac(algo, this.db.get("secret"));
      hmac.update(body, "utf-8");
      if (headers["X-Hub-Signature"] !== `${algo}=${hmac.digest("hex")}`) {
        throw new Error("signature mismatch");
      }
    }

    if ("zen" in body) {
      console.log("Zen event to confirm subscription, nothing to emit");
      return;
    }

    this.$emit(body, {
      summary: JSON.stringify(body),
    });
  },
};
