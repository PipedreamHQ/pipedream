import airtable from "../../airtable_oauth.app.mjs";
import constants from "../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  name: "New Record Created, Updated or Deleted (Instant)",
  description: "Emit new event when a record is added, updated, or deleted in a table or selected view. [See the documentation](https://airtable.com/developers/web/api/create-a-webhook)",
  key: "airtable_oauth-new-modified-or-deleted-records-instant",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
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
    dataTypes: {
      type: "string[]",
      label: "Data Types",
      description: "Select the object types that should emit events when updated.",
      options: constants.DATA_TYPES,
    },
    infoBox1: {
      type: "alert",
      alertType: "info",
      content: "You can select which types of activity to emit events for, using the `Update Types` prop below - otherwise, all record updates will emit events.",
    },
    changeTypes: {
      type: "string[]",
      label: "Update Types",
      description: "Select the types of record updates that should emit events. If not specified, all updates will emit events.",
      options: constants.CHANGE_TYPES,
      optional: true,
    },
    infoBox2: {
      type: "alert",
      alertType: "info",
      content: "You can also select a table or a specific view to get updates from. Further levels of customization are also available in the other optional props below.",
    },
    tableId: {
      propDefinition: [
        airtable,
        "tableId",
        (c) => ({
          baseId: c.baseId,
        }),
      ],
      description: "Only emit events for updates in the specified Table Id",
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
      description: "Only emit events for updates in the specified View Id",
      optional: true,
    },
    fromSouces: {
      type: "string[]",
      label: "From Sources",
      description: "Only emit events for updates from these sources. If omitted, updates from all sources are reported",
      options: constants.FROM_SOURCES,
      optional: true,
    },
    watchDataInFieldIds: {
      propDefinition: [
        airtable,
        "sortFieldId",
        (c) => ({
          baseId: c.baseId,
          tableId: c.tableId,
        }),
      ],
      type: "string[]",
      label: "Watch Data In Field Ids",
      description: "Only emit events for updates that modify values in cells in these fields. If omitted, all fields within the table/view/base are watched",
    },
    watchSchemasOfFieldIds: {
      propDefinition: [
        airtable,
        "sortFieldId",
        (c) => ({
          baseId: c.baseId,
          tableId: c.tableId,
        }),
      ],
      type: "string[]",
      label: "Watch Schemas of Field Ids",
      description: "Only emit events for updates that modify the schemas of these fields. If omitted, schemas of all fields within the table/view/base are watched",
    },
    includeCellValuesInFieldIds: {
      propDefinition: [
        airtable,
        "sortFieldId",
        (c) => ({
          baseId: c.baseId,
          tableId: c.tableId,
        }),
      ],
      type: "string[]",
      label: "Include Cell Values in Field Ids",
      description: "Fields to include in the event payload, regardless of whether or not they changed",
    },
    includePreviousCellValues: {
      type: "boolean",
      label: "Include Previous Cell Values",
      description: "If true, include the previous cell value in the event payload",
      optional: true,
    },
    includePreviousFieldDefinitions: {
      type: "boolean",
      label: "Include Previous Field Definitions",
      description: "If true, include the previous field definition in the event payload",
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
                dataTypes: this.dataTypes,
                changeTypes: this.changeTypes,
                fromSources: this.fromSources,
                watchDataInFieldIds: this.watchDataInFieldIds,
                watchSchemasOfFieldIds: this.watchSchemasOfFieldIds,
              },
              includes: {
                includeCellValuesInFieldIds: this.includeCellValuesInFieldIds,
                includePreviousCellValues: this.includePreviousCellValues,
                includePreviousFieldDefinitions: this.includePreviousFieldDefinitions,
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
  sampleEmit,
};
