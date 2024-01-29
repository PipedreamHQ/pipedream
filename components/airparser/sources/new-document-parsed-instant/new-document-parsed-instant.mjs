import { axios } from "@pipedream/platform";
import airparser from "../../airparser.app.mjs";

export default {
  key: "airparser-new-document-parsed-instant",
  name: "New Document Parsed Instant",
  description: "Emit new event when a document, new or old, is parsed",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    airparser: {
      type: "app",
      app: "airparser",
    },
    documentId: {
      propDefinition: [
        airparser,
        "documentId",
      ],
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const documentDetails = await this.airparser.getDocument(this.documentId);
      this.db.set("lastModifiedTime", documentDetails.updated_at);
    },
  },
  methods: {
    checkForNewDocument: async function() {
      const documentDetails = await this.airparser.getDocument(this.documentId);
      const lastModifiedTime = this.db.get("lastModifiedTime");
      if (documentDetails.updated_at > lastModifiedTime) {
        this.db.set("lastModifiedTime", documentDetails.updated_at);
        return true;
      }
      return false;
    },
  },
  async run(event) {
    const isValidRequest = await this.checkForNewDocument();
    if (!isValidRequest) {
      this.http.respond({
        status: 200,
      });
      return;
    }
    const documentDetails = await this.airparser.getDocument(this.documentId);
    this.$emit(documentDetails, {
      id: documentDetails.id,
      summary: `New document parsed: ${documentDetails.name}`,
      ts: Date.parse(documentDetails.updated_at),
    });
    this.http.respond({
      status: 200,
    });
  },
};
