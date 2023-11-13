import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import Dromo from "../../dromo.app.mjs";

export default {
  key: "dromo-new-data-row-imported",
  name: "New Data Row Imported",
  description: "Emits a new event when an import has been completed successfully.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dromo: {
      type: "app",
      app: "dromo",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    schemaId: {
      propDefinition: [
        Dromo,
        "schemaId",
      ],
    },
  },
  methods: {
    _getImportId() {
      return this.db.get("importId");
    },
    _setImportId(id) {
      this.db.set("importId", id);
    },
  },
  hooks: {
    async deploy() {
      const imports = await this.dromo._makeRequest({
        path: "/headless/imports/",
      });

      if (imports.length > 0) {
        const recentImport = imports[imports.length - 1];
        this._setImportId(recentImport.id);
      }
    },
  },
  async run() {
    const imports = await this.dromo._makeRequest({
      path: "/headless/imports/",
    });

    if (imports.length > 0) {
      const recentImport = imports[imports.length - 1];

      if (recentImport.id !== this._getImportId()) {
        this._setImportId(recentImport.id);
        this.$emit(recentImport, {
          id: recentImport.id,
          summary: `New Data Row Imported: ${recentImport.original_filename}`,
          ts: Date.parse(recentImport.created_date),
        });
      }
    }
  },
};
