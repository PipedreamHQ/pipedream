import airtable from "../../airtable_oauth.app.mjs";
import constants from "../common/constants.mjs";

export default {
  props: {
    airtable,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    baseId: {
      propDefinition: [
        airtable,
        "baseId",
      ],
    },
    tableId: {
      propDefinition: [
        airtable,
        "tableId",
        (c) => ({
          baseId: c.baseId,
        }),
      ],
      description: "If specified, events will only be emitted for the selected Table",
      optional: true,
    },
    viewId: {
      propDefinition: [
        airtable,
        "viewId",
        (c) => ({
          baseId: c.baseId,
          tableId: c.tableId,
        }),
      ],
      description: "If specified, events will only be emitted for the selected View",
      optional: true,
    },
    fromSources: {
      type: "string[]",
      label: "From Sources",
      description: "Only emit events for updates from these sources. If omitted, updates from all sources are reported",
      options: constants.FROM_SOURCES,
      optional: true,
    },
  },
  hooks: {
    async activate() {
      const { id } = await this.airtable.createWebhook({
        baseId: this.baseId,
        data: {
          notificationUrl: `${this.http.endpoint}/`,
          specification: {
            options: {
              filters: {
                recordChangeScope: this.viewId
                  ? this.viewId
                  : this.tableId
                    ? this.tableId
                    : undefined,
                dataTypes: this.getDataTypes(),
                changeTypes: this.getChangeTypes(),
                fromSources: this.fromSources,
                watchDataInFieldIds: this.watchDataInFieldIds,
                watchSchemasOfFieldIds: this.watchSchemasOfFieldIds,
              },
              includes: {
                includeCellValuesInFieldIds: this.includeCellValuesInFieldIds,
                includePreviousCellValues: true,
                includePreviousFieldDefinitions: true,
              },
            },
          },
        },
      });
      this._setHookId(id);
    },
    async deactivate() {
      const webhookId = this._getHookId();
      if (webhookId) {
        await this.airtable.deleteWebhook({
          baseId: this.baseId,
          webhookId,
        });
      }
    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getSpecificationOptions() {
      throw new Error("getSpecificationOptions is not implemented");
    },
    generateMeta(payload) {
      return {
        id: payload.baseTransactionNumber,
        summary: `New Event ${payload.baseTransactionNumber}`,
        ts: Date.parse(payload.timestamp),
      };
    },
    getDataTypes() {
      return this.dataTypes;
    },
    getChangeTypes() {
      return this.changeTypes;
    },
  },
  async run() {
    this.http.respond({
      status: 200,
    });
    // webhook pings source, we then fetch webhook events to emit
    const webhookId = this._getHookId();
    let hasMore = false;
    const params = {};
    do {
      const {
        cursor, mightHaveMore, payloads,
      } = await this.airtable.listWebhookPayloads({
        baseId: this.baseId,
        webhookId,
        params,
      });
      for (const payload of payloads) {
        const meta = this.generateMeta(payload);
        this.$emit(payload, meta);
      }
      params.cursor = cursor;
      hasMore = mightHaveMore;
    } while (hasMore);
  },
};
