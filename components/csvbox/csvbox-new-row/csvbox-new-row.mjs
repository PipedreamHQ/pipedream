import app from "../csvbox.app.mjs";

export default {
  key: "csvbox-new-row",
  name: "Import New Row",
  description: "Emit new events when a new row is added to a CSVBox sheet",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    app,
    sheetId: {
      propDefinition: [app, "sheetId"],
      description: "Select the sheet to receive data from",
    },
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      if (!this.sheetId) {
        throw new Error("Sheet selection is required before activation.");
      }

      try {
        const { data } = await this.app.createHook({
          data: {
            sheet_slug: this.sheetId,
            webhook_url: this.http.endpoint,
          },
        });

        const { webhookId, sample_response } = data;
        this._setHookID(webhookId);

        if (!Array.isArray(sample_response) || sample_response.length === 0) {
          throw new Error("Unable to fetch sample data from selected sheet.");
        }

        const first = sample_response[0];
        const sampleId = `sample_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        this.$emit({
          import_id: sampleId,
          sheet_id: this.sheetId,
          sheet_name: first.sheet_name || "Sample Data",
          row_number: first.row_number || 1,
          row_data: first.row_data || first,
          total_rows: first.total_rows || 10,
          env_name: first.env_name || "default",
          custom_fields: first.custom_fields || { user_id: "default123" },
          import_description: first.import_description || "This is a sample test import",
          original_filename: first.original_filename || "product_details.csv",
        }, {
          id: sampleId,
          summary: `Sample data loaded from sheet - ${first.sheet_name}`,
          ts: Date.now(),
        });

        this._setSampleRow(first);
      } catch (err) {
        console.error("Error during source activation:", err);
        const error = new Error(`Failed to register webhook or fetch sample data: ${err?.message}`);
        error.cause = err;
        throw error;
      }
    },
    async deactivate() {
      try {
        const hookId = this._getHookID();
        if (hookId) {
          await this.app.deleteHook({
            data: {
              webhook_id: hookId,
              sheet_slug: this.sheetId,
            },
          });
          this._setHookID(null);
          this._setSampleRow(null);
        }
      } catch (err) {
        console.error("Error during deactivate webhook:", err);
        const error = new Error(`Failed to deactivate webhook during deactivation: ${err?.message}`);
        error.cause = err;
        throw error;
      }
    },
    async deploy() {
      const sampleRow = this._getSampleRow();
      if (!sampleRow) {
        console.log("No sample row data found to emit during deploy.");
      }
      // Sample already emitted during activation; skipping duplicate emission
    },
  },
  methods: {
    /**
     * Retrieves the stored webhook ID from persistent storage
     * @returns {string|null} The webhook ID or null if not set
     */
    _getHookID() {
      return this.db.get("hookId");
    },
    /**
     * Stores the webhook ID in persistent storage
     * @param {string|null} hookID - The webhook ID to store
     */
    _setHookID(hookID) {
      this.db.set("hookId", hookID);
    },
    /**
     * Retrieves the stored sample row data from persistent storage
     * @returns {object|null} The sample row data or null if not set
     */
    _getSampleRow() {
      return this.db.get("sampleRow");
    },
    /**
     * Stores sample row data in persistent storage
     * @param {object|null} rowData - The sample row data to store
     */
    _setSampleRow(rowData) {
      this.db.set("sampleRow", rowData);
    },
  },
  async run(event) {
    const { body } = event;

    if (!Array.isArray(body) || body.length === 0) {
      console.error("Received webhook payload without row data");
      return;
    }

    for (const row of body) {
      this.$emit(row, {
        id: row.import_id || `${row.sheet_id}_${row.row_number}_${Date.now()}`,
        summary: `New data imported to sheet ${row.sheet_name}`,
        ts: Date.now(),
      });
    }
  },
  sampleEvents: [
    {
      import_id: 79418895,
      sheet_id: 55,
      sheet_name: "Products",
      row_number: 1,
      row_data: {
        "col1": "",
        "col2": "",
        "col3": "",
        "col4": "",
        "col5": "",
      },
      total_rows: 10,
      env_name: "default",
      custom_fields: {
        user_id: "default123"
      },
      import_description: "This is a sample test import",
      original_filename: "product_details.csv",
    }
  ],
};
