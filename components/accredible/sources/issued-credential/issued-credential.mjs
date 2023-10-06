import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-issued-credential",
  name: "Issued Credential",
  description: "This source triggers when a new credential is issued to a recipient.",
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
    _getCredentialId() {
      return this.db.get("credentialId") || 0;
    },
    _setCredentialId(credentialId) {
      this.db.set("credentialId", credentialId);
    },
  },
  hooks: {
    async deploy() {
      const credential = await this.accredible.getCredential({
        credentialId: this.credentialId,
      });

      if (credential) {
        this.$emit(credential, {
          id: credential.id,
          summary: `New Credential Issued: ${credential.name}`,
          ts: Date.parse(credential.created_at),
        });

        this._setCredentialId(credential.id);
      }
    },
  },
  async run() {
    const credential = await this.accredible.getCredential({
      credentialId: this.credentialId,
    });

    if (credential && credential.id > this._getCredentialId()) {
      this.$emit(credential, {
        id: credential.id,
        summary: `New Credential Issued: ${credential.name}`,
        ts: Date.parse(credential.created_at),
      });

      this._setCredentialId(credential.id);
    }
  },
};
