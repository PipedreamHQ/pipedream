import { axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-issued-credential",
  name: "Issued Credential",
  description: "Emits an event each time a new credential is issued to a recipient.",
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
    recipientEmail: {
      propDefinition: [accredible, "recipientEmail"],
    },
    credential: {
      propDefinition: [accredible, "credential"],
    },
  },
  methods: {
    _getLastCredentialId() {
      return this.db.get("lastCredentialId") || null;
    },
    _setLastCredentialId(id) {
      this.db.set("lastCredentialId", id);
    },
  },
  async run() {
    let lastCredentialId = this._getLastCredentialId();
    const credentials = await this.accredible.issueCredential({
      recipientEmail: this.recipientEmail,
      credential: this.credential,
    });

    for (const credential of credentials) {
      if (credential.id !== lastCredentialId) {
        this.$emit(credential, {
          id: credential.id,
          summary: `New Credential Issued: ${credential.name}`,
          ts: Date.now(),
        });
        lastCredentialId = credential.id;
      } else {
        break;
      }
    }
    this._setLastCredentialId(lastCredentialId);
  },
};