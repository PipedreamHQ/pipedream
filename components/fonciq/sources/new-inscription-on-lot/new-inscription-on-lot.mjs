import fonciq from "../../fonciq.app.mjs";
import { APP_DESCRIPTION_FR, APP_DESCRIPTION_EN } from "../../common/copy.mjs";

export default {
  key: "fonciq-new-inscription-on-lot",
  name: "New Inscription on Lot",
  version: "0.0.1",
  type: "source",
  description: `Triggers when a new registration number appears on GET /v1/lots/{lot} (stored profile). ${APP_DESCRIPTION_FR} Pour les webhooks de surveillance signés, utilisez votre URL Pipedream dans « Ajouter une surveillance ». / ${APP_DESCRIPTION_EN} For signed watch webhooks, use your Pipedream URL in Add watch.`,
  dedupe: "unique",
  props: {
    fonciq,
    db: "$.service.db",
    lot: {
      propDefinition: [fonciq, "lot"],
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60,
      },
    },
  },
  hooks: {
    async deploy() {},
    async deactivate() {},
  },
  methods: {
    async loadInscriptions() {
      return this.db.get("inscriptions") || null;
    },
    async saveInscriptions(list) {
      await this.db.set("inscriptions", list);
    },
  },
  async run({ $ }) {
    const lot = (this.lot || "").trim();
    if (!lot) {
      throw new Error("Le numéro de lot est requis. / Lot number is required.");
    }

    const profile = await this.fonciq.fonciqRequest($, {
      path: `/v1/lots/${encodeURIComponent(lot)}`,
    });

    const current = profile?.registre?.inscriptions || [];
    const previous = await this.loadInscriptions();

    if (previous === null) {
      await this.saveInscriptions(current);
      return;
    }

    const added = current.filter((ins) => !previous.includes(ins));
    await this.saveInscriptions(current);

    for (const inscription of added) {
      const item = {
        id: `${lot}-${inscription}`,
        lot,
        inscription,
        inscriptions: current,
        profile,
      };
      this.$emit(item, {
        id: item.id,
        summary: `Nouvelle inscription ${inscription} sur lot ${lot} / New inscription ${inscription} on lot ${lot}`,
        ts: Date.now(),
      });
    }
  },
};


