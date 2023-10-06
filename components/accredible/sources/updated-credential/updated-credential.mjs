import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-updated-credential",
  name: "Updated Credential",
  description: "Emit new event when an existing credential's details are updated or modified.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    accredible,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    credentialId: {
      propDefinition: [
        accredible,
        "credentialId",
      ],
    },
  },
  methods: {
    _getCredentialData() {
      return this.db.get("credentialData");
    },
    _setCredentialData(credentialData) {
      this.db.set("credentialData", credentialData);
    },
  },
  hooks: {
    async deploy() {
      const credential = await this.accredible.getCredential({
        credentialId: this.credentialId,
      });
      this._setCredentialData(credential);
    },
  },
  async run() {
    const credential = await this.accredible.getCredential({
      credentialId: this.credentialId,
    });

    if (JSON.stringify(credential) !== this._getCredentialData()) {
      this._setCredentialData(JSON.stringify(credential));
      this.$emit(credential, {
        id: credential.id,
        summary: `Credential with ID ${credential.id} was updated.`,
        ts: Date.now(),
      });
    }
  },
};
