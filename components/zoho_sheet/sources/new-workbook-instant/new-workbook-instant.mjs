import zohoSheet from "../../zoho_sheet.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "zoho_sheet-new-workbook-instant",
  name: "New Workbook Created",
  description: "Emit new event whenever a new workbook is created. [See the documentation](https://www.zoho.com/sheet/help/api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    zohoSheet,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    location: {
      propDefinition: [
        zohoSheet,
        "location",
      ],
      optional: true,
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
      const events = await this.zohoSheet.emitNewWorkbookEvent({
        location: this.location,
      });
      events.slice(0, 50).forEach((event) => {
        this.$emit(event, {
          id: event.id,
          summary: `New workbook: ${event.name}`,
          ts: Date.parse(event.created_time),
        });
      });
    },
    async activate() {
      const options = {
        location: this.location,
      };
      const webhookId = await this.zohoSheet.emitNewWorkbookEvent(options);
      this._setWebhookId(webhookId);
    },
    async deactivate() {
      const id = this._getWebhookId();
      if (id) {
        await this.zohoSheet.emitNewWorkbookEvent({
          id,
          method: "DELETE",
        });
      }
    },
  },
  async run(event) {
    const { body } = event;
    this.$emit(body, {
      id: body.id,
      summary: `New workbook: ${body.name}`,
      ts: Date.parse(body.created_time),
    });
  },
};
