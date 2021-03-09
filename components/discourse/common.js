const crypto = require("crypto");
const discourse = require("./discourse.app");

module.exports = {
  props: {
    http: "$.interface.http",
    db: "$.service.db",
    discourse,
    categories: { propDefinition: [discourse, "categories"] },
  },
  dedupe: "unique",
  methods: {
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
