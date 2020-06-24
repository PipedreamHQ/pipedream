//const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
const github = require("./github.app.js");
const events = ["create"]
const eventTypes = ['branch']

function generateMeta(data) {
  return {
    summary: `New Branch: ${data.ref} by ${data.sender.login}`,
  }
}

module.exports = {
  name: "New Branch",
  description: "Triggers when a new branch is created",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    http: "$.interface.http",
    github,
    repoFullName: { propDefinition: [github, "repoFullName"] },
  },
  hooks: {
    async activate() {
      const secret = await this.github.generateSecret();
      const { id } = await this.github.createHook({
        repoFullName: this.repoFullName,
        endpoint: this.http.endpoint,
        events,
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

    if (eventTypes.indexOf(body.ref_type) > -1) {
      const meta = generateMeta(body)
      this.$emit(body, meta);
    }
  },
};
