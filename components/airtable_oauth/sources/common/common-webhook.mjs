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
    _getLastObjectId() {
      return this.db.get("lastObjectId");
    },
    async _setLastObjectId(id) {
      this.db.set("lastObjectId", id);
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    async _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
    isDuplicateEvent(id, ts) {
      const lastId = this._getLastObjectId();
      const lastTs = this._getLastTimestamp();

      if (id === lastId && (ts - lastTs < 5000 )) {
        console.log("Skipping trigger: another event was emitted for the same object within the last 5 seconds");
        return true;
      }

      return false;
    },
    getSpecificationOptions() {
      throw new Error("getSpecificationOptions is not implemented");
    },
    generateMeta(payload, summary) {
      return {
        id: payload.baseTransactionNumber,
        summary: summary ?? `New Event ${payload.baseTransactionNumber}`,
        ts: Date.parse(payload.timestamp),
      };
    },
    getDataTypes() {
      return this.dataTypes;
    },
    getChangeTypes() {
      return this.changeTypes;
    },
    emitDefaultEvent(payload) {
      // Normalize the fallback so consumers always get a consistent structure
      // matching our other emitters (which include originalPayload).
      const meta = this.generateMeta(payload);
      this.$emit({
        originalPayload: payload,
      }, meta);
    },
    async emitEvent(payload) {
      // sources may call this to customize event emission, but it is
      // a separate method so that the source may fall back to default
      return this.emitDefaultEvent(payload);
    },
    async saveAdditionalData() {
      // sources may call this to fetch additional data (e.g. field schemas)
      // and it can be silently ignored when not required
      return true;
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
    try {
      await this.saveAdditionalData();
    } catch (err) {
      console.log("Error fetching additional data, proceeding to event emission");
      console.log(err);
    }
    do {
      const {
        cursor, mightHaveMore, payloads,
      } = await this.airtable.listWebhookPayloads({
        baseId: this.baseId,
        webhookId,
        params,
      });
      for (const payload of payloads) {
        try {
          await this.emitEvent(payload);
        } catch (err) {
          console.log("Error emitting event, defaulting to default emission");
          console.log(err);
          this.emitDefaultEvent(payload);
        }
      }
      params.cursor = cursor;
      hasMore = mightHaveMore;
    } while (hasMore);
  },
};
