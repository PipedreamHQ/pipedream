import fonciq from "../../fonciq.app.mjs";
import { APP_DESCRIPTION_FR, APP_DESCRIPTION_EN } from "../../common/copy.mjs";

export default {
  key: "fonciq-list-watches",
  name: "List Watches",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  description: `${APP_DESCRIPTION_FR} GET /v1/watches (portée watches:write). / ${APP_DESCRIPTION_EN} GET /v1/watches (scope watches:write).`,
  props: {
    fonciq,
    lot: {
      propDefinition: [fonciq, "lot"],
      optional: true,
      description: "Filtrer par lot (optionnel) / Filter by lot (optional).",
    },
  },
  async run({ $ }) {
    const body = await this.fonciq.fonciqRequest($, { path: "/v1/watches" });
    const watches = body.watches || [];
    const lotFilter = (this.lot || "").trim();
    const filtered = lotFilter ? watches.filter((w) => w.lot === lotFilter) : watches;
    $.export("$summary", `${filtered.length} watch(es)`);
    return filtered;
  },
};


