import pdffiller from "../../pdffiller.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pdffiller-document-copied-instant",
  name: "Document Copied Instant",
  description: "Emit new event when a new document is created based on another template. [See the documentation](https://docs.pdffiller.com/docs/pdffiller/zmnt034fyekxf-pdf-filler-api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    pdffiller: {
      type: "app",
      app: "pdffiller",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    sourceTemplateId: {
      propDefinition: [
        pdffiller,
        "sourceTemplateId",
      ],
    },
    targetTemplateId: {
      propDefinition: [
        pdffiller,
        "targetTemplateId",
      ],
    },
  },
  methods: {
    _getCallbackId() {
      return this.db.get("callbackId");
    },
    _setCallbackId(id) {
      this.db.set("callbackId", id);
    },
  },
  hooks: {
    async deploy() {
      const documents = await axios(this, {
        method: "GET",
        url: `${this.pdffiller._baseUrl()}/templates/${this.sourceTemplateId}/filled-documents`,
        headers: {
          Authorization: `Bearer ${this.pdffiller.$auth.oauth_access_token}`,
        },
      });

      for (const document of documents) {
        this.$emit(document, {
          id: document.id,
          summary: `New document copied from template ${this.sourceTemplateId}`,
          ts: Date.parse(document.created),
        });
      }
    },
    async activate() {
      const callbackUrl = this.http.endpoint;
      const { id: callbackId } = await this.pdffiller.createCallback({
        documentId: this.targetTemplateId,
        eventId: "document.copied",
        callbackUrl,
      });
      this._setCallbackId(callbackId);
    },
    async deactivate() {
      const callbackId = this._getCallbackId();
      if (callbackId) {
        await axios(this, {
          method: "DELETE",
          url: `${this.pdffiller._baseUrl()}/callbacks/${callbackId}`,
          headers: {
            Authorization: `Bearer ${this.pdffiller.$auth.oauth_access_token}`,
          },
        });
      }
    },
  },
  async run(event) {
    const { body: document } = event;
    this.$emit(document, {
      id: document.id,
      summary: `New document copied from template ${this.sourceTemplateId}`,
      ts: Date.parse(document.created),
    });
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
