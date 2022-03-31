const github = require("../github.app.js");

module.exports = {
  props: {
    github,
    repoFullName: {
      propDefinition: [
        github,
        "repoFullName",
      ],
    },
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    emitEvent(body, id) {
      const eventTypes = this.getEventTypes();
      if (eventTypes.includes(body.action)) {
        const meta = this.generateMeta(body, id);
        this.$emit(body, meta);
      }
    },
  },
  hooks: {
    async activate() {
      const secret = await this.github.generateSecret();
      const eventNames = this.getEventNames();
      const { id } = await this.github.createHook({
        repoFullName: this.repoFullName,
        endpoint: this.http.endpoint,
        events: eventNames,
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
    const {
      body,
      headers,
    } = event;
    if (!headers["x-hub-signature"]) {
      throw new Error("signature missing");
    }

    const crypto = require("crypto");
    const algo = "sha1";
    const hmac = crypto.createHmac(algo, this.db.get("secret"));
    hmac.update(JSON.stringify(body), "utf-8");
    if (headers["x-hub-signature"] !== `${algo}=${hmac.digest("hex")}`) {
      throw new Error("signature mismatch");
    }

    if ("zen" in body) {
      console.log("Zen event to confirm subscription, nothing to emit. Exiting");
      return;
    }

    this.emitEvent(body, headers["x-github-delivery"]);
  },
};
