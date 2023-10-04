import { axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import accredible from "../../accredible.app.mjs";

export default {
  key: "accredible-updated-credential",
  name: "Updated Credential",
  description: "Emits an event each time a credential is updated in Accredible",
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
    credentialId: accredible.propDefinitions.credentialId,
  },
  methods: {
    _getCredentialId() {
      return this.db.get("credentialId") || null;
    },
    _setCredentialId(id) {
      this.db.set("credentialId", id);
    },
  },
  async run() {
    const credentialId = this._getCredentialId();
    if(credentialId) {
      const { data: credential } = await this.accredible.updateCredential({ credentialId });
      this.$emit(credential, {
        id: credential.id,
        summary: `Credential ${credential.id} updated`,
        ts: Date.now(),
      });
      this._setCredentialId(credential.id);
    }
  },
};