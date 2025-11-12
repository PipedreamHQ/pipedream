import dockCerts from "../../dock_certs.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "dock_certs-new-credential-issued",
  name: "New Credential Issued",
  description: "Emit new event when a new credential is issued. [See the documentation](https://docs.api.dock.io/?json-doc#get-credentials-metadata)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    dockCerts,
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
      const credentials = await this.dockCerts.paginate({
        resourceFn: this.dockCerts.listCredentials,
        maxResults: 25,
      });

      this.processCredentials(credentials);
    },
  },
  methods: {
    _getLastIssueDate() {
      return this.db.get("lastIssueDate") || 0;
    },
    _setLastIssueDate(lastIssueDate) {
      this.db.set("lastIssueDate", lastIssueDate);
    },
    generateMeta(credential) {
      return {
        id: credential.id,
        summary: credential.subjectRef,
        ts: Date.parse(credential.issuanceDate),
      };
    },
    processCredentials(credentials) {
      const lastIssueDate = this._getLastIssueDate();
      let maxLastIssueDate = lastIssueDate;

      for (const credential of credentials) {
        const issueDate = Date.parse(credential.issuanceDate);
        if (issueDate > maxLastIssueDate) {
          maxLastIssueDate = issueDate;
        }
        if (issueDate > lastIssueDate) {
          const meta = this.generateMeta(credential);
          this.$emit(credential, meta);
        }
      }

      this._setLastIssueDate(maxLastIssueDate);
    },
  },
  async run() {
    const credentials = await this.dockCerts.paginate({
      resourceFn: this.dockCerts.listCredentials,
    });

    this.processCredentials(credentials);
  },
};
