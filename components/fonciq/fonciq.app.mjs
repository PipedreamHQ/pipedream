import { APP_DESCRIPTION, API_KEY_HELP } from "./common/copy.mjs";
import { fonciqRequest } from "./common/api.mjs";

export default {
  type: "app",
  app: "fonciq",
  propDefinitions: {
    lot: {
      type: "string",
      label: "Numéro de lot / Lot number",
      description: "Lot surveillé ou suivi. / Watched or tracked lot.",
    },
    jobId: {
      type: "string",
      label: "Identifiant de tâche / Job ID",
      description: "Ex. job_… renvoyé par une demande d’index. / e.g. job_… from an index request.",
    },
  },
  methods: {
    async testConnection($) {
      return fonciqRequest($, this.$auth, {
        path: "/v1/platform/billing",
      });
    },
    fonciqRequest($, opts) {
      return fonciqRequest($, this.$auth, opts);
    },
  },
  description: `${APP_DESCRIPTION} ${API_KEY_HELP}`,
};


