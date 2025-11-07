import app from "../csvbox.app.mjs";

export default {
  key: "csvbox-new-row",
  name: "New Import",
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
        const hookId = webhookId;
        this._setHookID(hookId);

        if (!Array.isArray(sample_response) || sample_response.length === 0) {
          throw new Error("Unable to fetch sample data from selected sheet.");
        }

        const first = sample_response[0];
        this.$emit({
          import_id: `sample_${Date.now()}`,
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
          id: `sample_${Date.now()}`,
          summary: `Sample data loaded from sheet - ${first.sheet_name} `,
          ts: Date.now(),
        });

        
        this._setSampleRow(first);
      } catch (err) {
        console.error("Error during source activation:", err);
        throw new Error(err?.message || "Failed to register webhook or fetch sample data.");
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
          this.db.set("hookId", null);
          this.db.set("sampleRow", null);
        }
      } catch (err) {
        console.error("Deactivation Error:", err);
      }
    },
    async deploy() {
      const sampleRow = this._getSampleRow();
      if (sampleRow) {
        this.$emit(sampleRow, {
          id: `sample_${Date.now()}`,
          summary: "Sample row event",
          ts: Date.now(),
        });
      }
      else {
        console.log("No sample row data found to emit during deploy.");
        return;
      }
    },
  },
  methods: {
    _getHookID() {
      return this.db.get("hookId");
    },
    _setHookID(hookID) {
      this.db.set("hookId", hookID);
    },
    _getSampleRow() {
      return this.db.get("sampleRow");
    },
    _setSampleRow(rowData) {
      this.db.set("sampleRow", rowData);
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      console.error("Received empty webhook body");
      return;
    }

    this.$emit(body, {
      id: body[0].import_id || `${body[0].sheet_id}_${Date.now()}`,
      summary: `New data imported to sheet ${body[0].sheet_name}`,
      ts: Date.now(),
    });
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
