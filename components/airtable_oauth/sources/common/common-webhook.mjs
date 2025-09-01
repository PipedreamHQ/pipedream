import { createHmac } from "crypto";
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
      const {
        id, macSecretBase64,
      } = await this.airtable.createWebhook({
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
      this._setMacSecretBase64(macSecretBase64);
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
    _getMacSecretBase64() {
      return this.db.get("macSecretBase64");
    },
    _setMacSecretBase64(value) {
      this.db.set("macSecretBase64", value);
    },
    _setLastCursor(cursor) {
      this.db.set("lastCursor", cursor);
    },
    _getLastCursor() {
      return this.db.get("lastCursor");
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
    isSignatureValid(signature, bodyRaw) {
      const macSecretBase64FromCreate = this._getMacSecretBase64();
      const macSecretDecoded = Buffer.from(macSecretBase64FromCreate, "base64");
      const body = Buffer.from(bodyRaw, "utf8");
      const hmac = createHmac("sha256", macSecretDecoded)
        .update(body.toString(), "ascii")
        .digest("hex");
      const expectedContentHmac = "hmac-sha256=" + hmac;
      return signature === expectedContentHmac;
    },
    payloadFilter() {
      return true;
    },
  },
  async run({
    bodyRaw, headers: { ["x-airtable-content-mac"]: signature },
  }) {
    const isValid = this.isSignatureValid(signature, bodyRaw);
    if (!isValid) {
      return this.http.respond({
        status: 401,
      });
    }

    this.http.respond({
      status: 200,
    });
    // webhook pings source, we then fetch webhook events to emit
    const webhookId = this._getHookId();
    let hasMore = false;

    try {
      await this.saveAdditionalData();
    } catch (err) {
      console.log("Error fetching additional data, proceeding to event emission");
      console.log(err);
    }
    const params = {
      cursor: this._getLastCursor(),
    };

    do {
      const {
        cursor, mightHaveMore, payloads,
      } = await this.airtable.listWebhookPayloads({
        debug: true,
        baseId: this.baseId,
        webhookId,
        params,
      });

      const filteredPayloads = payloads.filter(this.payloadFilter);

      for (const payload of filteredPayloads) {
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

    this._setLastCursor(params.cursor);
  },
};
