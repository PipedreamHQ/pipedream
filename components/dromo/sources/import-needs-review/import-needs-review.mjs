import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import dromo from "../../dromo.app.mjs";

export default {
  key: "dromo-import-needs-review",
  name: "Import Needs Review",
  description: "Emit new event when an import has issues and needs a review",
  version: "0.0.{{{{ts}}}}",
  type: "source",
  dedupe: "unique",
  props: {
    dromo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    schemaId: {
      propDefinition: [
        dromo,
        "schemaId",
      ],
    },
  },
  methods: {
    _getLastCheck() {
      return this.db.get("lastCheck") ?? new Date().toISOString();
    },
    _setLastCheck(lastCheck) {
      this.db.set("lastCheck", lastCheck);
    },
  },
  hooks: {
    async deploy() {
      this._setLastCheck(new Date().toISOString());
    },
  },
  async run() {
    let lastCheck = this._getLastCheck();
    let imports;
    do {
      const { data: fetchedImports } = await this.dromo._makeRequest({
        path: "/imports",
        params: {
          filter: {
            created: {
              _gt: lastCheck,
            },
            status: {
              _in: [
                "error",
              ],
            },
          },
        },
      });

      imports = fetchedImports;

      for (const importItem of imports) {
        this.$emit(importItem, {
          id: importItem.id,
          summary: `Import ${importItem.id} needs review`,
          ts: Date.parse(importItem.created),
        });
      }

      if (imports.length > 0) {
        lastCheck = new Date(imports[imports.length - 1].created).toISOString();
      }
    } while (imports.length >= 50);

    this._setLastCheck(new Date().toISOString());
  },
};
