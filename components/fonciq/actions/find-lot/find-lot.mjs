import fonciq from "../../fonciq.app.mjs";
import { APP_DESCRIPTION_FR, APP_DESCRIPTION_EN } from "../../common/copy.mjs";

export default {
  key: "fonciq-find-lot",
  name: "Find Lot",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  description: `${APP_DESCRIPTION_FR} GET /v1/lots/resolve (adresse ou matricule) ou GET /v1/lots/{lot}. Sans consultation du Registre. / ${APP_DESCRIPTION_EN} GET /v1/lots/resolve (address or matricule) or GET /v1/lots/{lot}. Does not consult the registry.`,
  props: {
    fonciq,
    lot: {
      propDefinition: [fonciq, "lot"],
      optional: true,
    },
    address: {
      type: "string",
      label: "Adresse / Address",
      optional: true,
    },
    matricule: {
      type: "string",
      label: "Matricule / Matricule",
      optional: true,
    },
  },
  async run({ $ }) {
    const lot = (this.lot || "").trim();
    const address = (this.address || "").trim();
    const matricule = (this.matricule || "").trim();

    if (lot) {
      const profile = await this.fonciq.fonciqRequest($, {
        path: `/v1/lots/${encodeURIComponent(lot)}`,
      });
      $.export("$summary", `Lot ${lot}`);
      return profile;
    }

    if (!address && !matricule) {
      throw new Error(
        "Indiquez lot, address ou matricule. / Provide lot, address, or matricule.",
      );
    }

    const resolved = await this.fonciq.fonciqRequest($, {
      path: "/v1/lots/resolve",
      params: {
        ...(address ? { address } : {}),
        ...(matricule ? { matricule } : {}),
      },
    });
    const lots = resolved.lots || [];
    $.export("$summary", `Found ${lots.length} lot(s)`);
    return lots;
  },
};


