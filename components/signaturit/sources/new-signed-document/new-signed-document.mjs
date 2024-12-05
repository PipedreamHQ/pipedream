import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import signaturit from "../../signaturit.app.mjs";

export default {
  key: "signaturit-new-signed-document",
  name: "New Signed Document",
  description: "Emit new event when a document has been newly signed. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    signaturit,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const signatures = await this.signaturit.listCompletedSignatures();
      const sortedSignatures = signatures.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      ).slice(0, 50);

      sortedSignatures.forEach((signature) => {
        this.$emit(signature, {
          id: signature.id,
          summary: `New signed document: ${signature.name}`,
          ts: new Date(signature.created_at).getTime(),
        });
      });

      if (sortedSignatures.length > 0) {
        const latestTimestamp = new Date(sortedSignatures[0].created_at).getTime();
        await this.db.set("last_run", latestTimestamp);
      }
    },
    async activate() {
      // No action needed on activate for polling source
    },
    async deactivate() {
      // No action needed on deactivate for polling source
    },
  },
  async run() {
    const lastRun = await this.db.get("last_run") || 0;
    const signatures = await this.signaturit.listCompletedSignatures();
    const newSignatures = signatures.filter((signature) => {
      const signatureTime = new Date(signature.created_at).getTime();
      return signatureTime > lastRun;
    }).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    newSignatures.forEach((signature) => {
      this.$emit(signature, {
        id: signature.id,
        summary: `New signed document: ${signature.name}`,
        ts: new Date(signature.created_at).getTime(),
      });
    });

    if (newSignatures.length > 0) {
      const latestSignature = newSignatures[newSignatures.length - 1];
      const latestTimestamp = new Date(latestSignature.created_at).getTime();
      await this.db.set("last_run", latestTimestamp);
    }
  },
};
