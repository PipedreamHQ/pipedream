import fonciq from "../../fonciq.app.mjs";
import { APP_DESCRIPTION_FR, APP_DESCRIPTION_EN } from "../../common/copy.mjs";

export default {
  key: "fonciq-get-document-entries",
  name: "Get Document Entries",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  description: `${APP_DESCRIPTION_FR} GET /v1/documents/{id}/entries. / ${APP_DESCRIPTION_EN} GET /v1/documents/{id}/entries.`,
  props: {
    fonciq,
    documentId: {
      type: "string",
      label: "Identifiant de document / Document ID",
    },
  },
  async run({ $ }) {
    const documentId = (this.documentId || "").trim();
    if (!documentId) {
      throw new Error("documentId est requis. / documentId is required.");
    }
    const block = await this.fonciq.fonciqRequest($, {
      path: `/v1/documents/${encodeURIComponent(documentId)}/entries`,
    });
    $.export("$summary", `Entries for ${documentId}`);
    return block;
  },
};


