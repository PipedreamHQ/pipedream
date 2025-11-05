import app from "../csvbox.app.mjs";

export default {
  key: "csvbox-new-row",
  name: "New Row",
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
      try {
        const { data } = await this.app.createHook({
          data: {
            sheet_id: this.sheetId,
            webhook_url: this.http.endpoint,
          },
        });
        this._setHookID(data);

        const rows = await this.app.getRows({
          sheetId: this.sheetId,
        });

        console.log("Fetched sample rows:", rows);
        // Store sample row if available
        if (rows?.length > 0) {
          this._setSampleRow(rows[0]);
        }
      } catch (err) {
        console.log("Activation Error:", err);
        throw err;
      }
    },
    async deactivate() {
      try {
        const hookId = this._getHookID();
        console.log("Deactivate webhook getHookId ", hookId);
        
        await this.app.deleteHook({
          data: {
            webhook_id: hookId,
            sheet_id: this.sheetId,
          },
        });
        this.db.set("hookId", null);
        // if (hookId) {
        // }
      } catch (err) {
        console.error("Deactivation Error:", err);
      }
    },
    async deploy() {
      console.log("Deploy hook called");
      const sampleRow = this._getSampleRow();
      if(sampleRow) {
        this.$emit({
          import_id: 79418895,
          sheet_id: 5,
          sheet_name: "Products",
          row_number: 1,
          row_data: sampleRow,
          total_rows: 1,
          env_name: "default",
          custom_fields: {
            user_id: "default123"
          },
          import_description: "This is a sample test import",
          original_filename: "product_details.csv"
        }, {
          id: `sample_${Date.now()}`,
          summary: "Sample row event",
          ts: Date.now(),
        });
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
