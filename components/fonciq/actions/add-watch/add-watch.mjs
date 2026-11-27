import fonciq from "../../fonciq.app.mjs";
import { newIdempotencyKey } from "../../common/api.mjs";
import { APP_DESCRIPTION_FR, APP_DESCRIPTION_EN } from "../../common/copy.mjs";

export default {
  key: "fonciq-add-watch",
  name: "Add Watch",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  description: `${APP_DESCRIPTION_FR} POST /v1/watches — création non facturée; chaque index tiré ensuite par la surveillance est un document facturé au portefeuille Fonciq sur clé fq_live_. / ${APP_DESCRIPTION_EN} POST /v1/watches — creating a watch is not billed; each later index pull is a document billed to the Fonciq wallet on fq_live_ keys.`,
  props: {
    fonciq,
    lot: {
      propDefinition: [fonciq, "lot"],
    },
    webhookUrl: {
      type: "string",
      label: "URL de webhook (https) / Webhook URL (https)",
      description: "URL Pipedream ou votre endpoint. / Pipedream or your endpoint URL.",
    },
    cadence: {
      type: "string",
      label: "Cadence / Cadence",
      options: ["weekly", "daily"],
      default: "weekly",
      optional: true,
    },
    rfAccountId: {
      type: "string",
      label: "Compte Registre (optionnel) / Registry account (optional)",
      optional: true,
    },
  },
  async run({ $ }) {
    const lot = (this.lot || "").trim();
    const url = (this.webhookUrl || "").trim();
    if (!lot || !url) {
      throw new Error(
        "lot et webhookUrl (https) sont requis. / lot and webhookUrl (https) are required.",
      );
    }

    const body = {
      lot,
      url,
      cadence: this.cadence || "weekly",
    };
    if (this.rfAccountId) {
      body.rf_account_id = this.rfAccountId;
    }

    const watch = await this.fonciq.fonciqRequest($, {
      method: "POST",
      path: "/v1/watches",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": newIdempotencyKey(),
      },
      data: body,
    });
    $.export("$summary", `Watch on lot ${lot}`);
    return watch;
  },
};


