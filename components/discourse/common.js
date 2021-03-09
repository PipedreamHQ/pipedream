const axios = require("axios");
const crypto = require("crypto");
const discourse = require("./discourse.app");

module.exports = {
  props: {
    http: "$.interface.http",
    db: "$.service.db",
    discourse,
  },
  dedupe: "unique",
  hooks: {
    async deactivate() {
      const hookID = this.db.get("hookID");
      await this.discourse.deleteHook({ hookID });
    },
  },
  methods: {
    // Generic activate method used in component-specific hooks
    async activate(webhookPayload) {
      const secret = this.discourse.generateSecret();
      this.db.set("secret", secret);
      const { id } = await this.discourse.createHook({
        endpoint: this.http.endpoint,
        secret,
        ...webhookPayload,
      });
      this.db.set("hookID", id);

      // Make a test request to the component's endpoint
      // to trigger test emits
      if (!this.isComponentInitialized()) {
        try {
          await axios({ url: this.http.endpoint });
        } catch (err) {
          console.log(`Failed to make test request to component: `, err);
          // If the test request fails, mark the component as initialized.
          // Otherwise, the first event will trigger the test event logic.
          this.markComponentAsInitialized();
        }
      }
    },
    verifySignature(header, body) {
      const algo = "sha256";
      const hmac = crypto.createHmac(algo, this.db.get("secret"));
      hmac.update(JSON.stringify(body), "utf-8");
      if (header !== `${algo}=${hmac.digest("hex")}`) {
        throw new Error(
          "Discourse signature does not match computed signature"
        );
      }
    },
    isComponentInitialized() {
      return this.db.get("isInitialized");
    },
    // Once the initialization code has been run for a component, we can
    // mark is as initialized so that we don't run the code again.
    markComponentAsInitialized() {
      return this.db.set("isInitialized", true);
    },
    // Reset the component initialization state so that we run the necessary
    // initialization code the next time the component is run.
    unsetComponentInitialization() {
      return this.db.set("isInitialized", false);
    },
    generateMeta() {
      throw new Error("Generate meta is not implemented");
    },
  },
};
