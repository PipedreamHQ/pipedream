import zohoSheet from "../../zoho_sheet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_sheet-new-row-instant",
  name: "New Row Created (Instant)",
  description: "Emit new event each time a new row is created in a Zoho Sheet worksheet. [See the documentation](https://www.zoho.com/sheet/help/api/v2/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    zohoSheet,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    worksheet: {
      propDefinition: [
        zohoSheet,
        "worksheet",
      ],
    },
  },
  methods: {
    _getWebhookId() {
      return this.db.get("webhookId");
    },
    _setWebhookId(id) {
      this.db.set("webhookId", id);
    },
  },
  hooks: {
    async deploy() {
      // Emits the 50 most recent row entries from the specified worksheet
      const recentRows = await this.zohoSheet.emitNewRowEvent({
        worksheet: this.worksheet,
      });
      for (const row of recentRows.slice(-50).reverse()) {
        this.$emit(row, {
          id: row.id,
          summary: `New row in worksheet: ${row.worksheetId}`,
          ts: Date.now(),
        });
      }
    },
    async activate() {
      const webhookId = await this.zohoSheet.emitNewRowEvent({
        worksheet: this.worksheet,
      });
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        await this.zohoSheet.deleteRow({
          worksheet: this.worksheet,
          criteria: {
            webhook_id: id,
          },
        });
      }
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.id,
      summary: `New row created in worksheet: ${this.worksheet}`,
      ts: Date.now(),
    });
  },
};
