import fonciq from "../../fonciq.app.mjs";
import {
  APP_DESCRIPTION_FR,
  APP_DESCRIPTION_EN,
  PAID_WALLET_FR,
  PAID_WALLET_EN,
} from "../../common/copy.mjs";

export default {
  key: "fonciq-get-property-index",
  name: "Get Property Index",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  description: `${APP_DESCRIPTION_FR} Lignes structurées via GET /v1/jobs/{id}/results, GET /v1/documents/{id}/entries ou le profil stocké GET /v1/lots/{lot}. Un tirage Registre frais passe par POST /v1/registre/requests (${PAID_WALLET_FR}). / ${APP_DESCRIPTION_EN} Structured lines via GET /v1/jobs/{id}/results, GET /v1/documents/{id}/entries, or stored GET /v1/lots/{lot}. A fresh registry pull uses POST /v1/registre/requests (${PAID_WALLET_EN}).`,
  props: {
    fonciq,
    jobId: {
      propDefinition: [fonciq, "jobId"],
      optional: true,
    },
    documentId: {
      type: "string",
      label: "Identifiant de document / Document ID",
      optional: true,
    },
    lot: {
      propDefinition: [fonciq, "lot"],
      optional: true,
      description: "Profil stocké / Stored profile.",
    },
  },
  async run({ $ }) {
    const jobId = (this.jobId || "").trim();
    const documentId = (this.documentId || "").trim();
    const lot = (this.lot || "").trim();

    if (jobId) {
      const results = await this.fonciq.fonciqRequest($, {
        path: `/v1/jobs/${encodeURIComponent(jobId)}/results`,
      });
      const blocks = results.indexes || (results.index ? [results.index] : []);
      $.export("$summary", `Job results for ${jobId}`);
      return blocks.map((block) => ({ ...block, source: "job", job_id: jobId }));
    }

    if (documentId) {
      const block = await this.fonciq.fonciqRequest($, {
        path: `/v1/documents/${encodeURIComponent(documentId)}/entries`,
      });
      $.export("$summary", `Document entries for ${documentId}`);
      return [{ ...block, source: "document", document_id: documentId }];
    }

    if (lot) {
      const profile = await this.fonciq.fonciqRequest($, {
        path: `/v1/lots/${encodeURIComponent(lot)}`,
      });
      $.export("$summary", `Stored index for lot ${lot}`);
      return [
        {
          lot: profile.lot,
          entries: profile?.registre?.entries || [],
          inscriptions: profile?.registre?.inscriptions || [],
          source: "stored",
        },
      ];
    }

    throw new Error(
      "Indiquez jobId, documentId ou lot. / Provide jobId, documentId, or lot.",
    );
  },
};


