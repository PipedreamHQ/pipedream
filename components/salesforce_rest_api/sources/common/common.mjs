import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import salesforce from "../../salesforce_rest_api.app.mjs";
import constants from "../../common/constants.mjs";
import { v4 as uuidv4 } from "uuid";
import commonWebhookMethods from "./common-webhook-methods.mjs";

export default {
  dedupe: "unique",
  props: {
    salesforce,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    timer: {
      type: "$.interface.timer",
      description: "The timer is only used as a fallback if instant event delivery (webhook) is not available.",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    objectType: {
      label: "Object Type",
      description: "The type of object for which to monitor events",
      propDefinition: [
        salesforce,
        "objectType",
      ],
    },
  },
  hooks: {
    async activate() {
      // Attempt to create the webhook
      const secretToken = uuidv4();
      let webhookData;
      try {
        webhookData = await this.createWebhook({
          endpointUrl: this.http.endpoint,
          sObjectType: this.objectType,
          event: this.getEventType(),
          secretToken,
          fieldsToCheck: this.getFieldsToCheck(),
          fieldsToCheckMode: this.getFieldsToCheckMode(),
          skipValidation: true, // neccessary for custom objects
        });
        console.log("Webhook created successfully");
      } catch (err) {
        console.log("Error creating webhook:", err);
        console.log("The source will operate on the polling schedule instead.");

        const latestDateCovered = this.getLatestDateCovered();
        if (!latestDateCovered) {
          const now = new Date().toISOString();
          this.setLatestDateCovered(now);
        }

        await this.timerActivateHook?.();
      }
      this._setSecretToken(secretToken);
      this._setWebhookData(webhookData);

      const nameField = await this.salesforce.getNameFieldForObjectType(this.objectType);
      this.setNameField(nameField);
    },
    async deactivate() {
      // Delete the webhook, if it exists
      const webhookData = this._getWebhookData();
      if (webhookData) {
        await this.deleteWebhook(webhookData);
      }
    },
  },
  methods: {
    ...commonWebhookMethods,
    timerActivateHook() {
      return null;
    },
    getObjectTypeColumns() {
      return this.db.get("columns") ?? [];
    },
    setObjectTypeColumns(columns) {
      this.db.set("columns", columns);
    },
    getLatestDateCovered() {
      return this.db.get("latestDateCovered");
    },
    setLatestDateCovered(latestDateCovered) {
      this.db.set("latestDateCovered", latestDateCovered);
    },
    getNameField() {
      return this.db.get("nameField");
    },
    setNameField(nameField) {
      this.db.set("nameField", nameField);
    },
    processTimerEvent() {
      throw new Error("processTimerEvent is not implemented");
    },
    getObjectTypeDescription(objectType) {
      const { salesforce } = this;
      return salesforce._makeRequest({
        url: salesforce._sObjectTypeDescriptionApiUrl(objectType),
      });
    },
    query({
      query, ...args
    } = {}) {
      const { salesforce } = this;
      const baseUrl = salesforce._baseApiVersionUrl();
      return salesforce._makeRequest({
        url: `${baseUrl}/query/?q=${encodeURIComponent(query)}`,
        ...args,
      });
    },
    queryObjects({
      objectType, columns,
      startTimestamp, endTimestamp,
      dateFieldName = constants.FIELD_NAME.CREATED_DATE,
      limit = 100, offset = 0, ...args
    } = {}) {
      return this.query({
        query: `
          SELECT ${columns.join(", ")}
            FROM ${objectType}
              WHERE ${dateFieldName} > ${startTimestamp} AND ${dateFieldName} <= ${endTimestamp}
              ORDER BY ${dateFieldName} DESC
              LIMIT ${limit} OFFSET ${offset}
        `,
        ...args,
      });
    },
    async paginate({
      fn = this.queryObjects, limit = 100, offset = 0, maxRecords = 4000, ...args
    } = {}) {
      let records = [];
      let nextRecords = [];

      do {
        ({ records: nextRecords } =
          await fn({
            ...args,
            offset,
            limit,
          }));

        records = [
          ...records,
          ...nextRecords,
        ];

        offset += limit;

      } while (records.length < maxRecords && nextRecords.length === limit);

      return records;
    },
  },
  async run(event) {
    // Timer event
    if (event.timestamp) {
      if (this._getWebhookData()) {
        console.log("Ignoring timer event (webhook active)");
        return;
      }

      const startTimestamp = this.getLatestDateCovered();

      if (this.skipFirstRun && !startTimestamp) {
        const now = new Date().toISOString();
        this.setLatestDateCovered(now);
        return;
      }

      const endTimestamp = new Date(event.timestamp * 1000).toISOString();
      const timeDiffSec = Math.floor(
        (Date.parse(endTimestamp) - Date.parse(startTimestamp)) / 1000,
      );
      if (timeDiffSec < 60) {
        console.log(`
          Skipping execution (already executed less than 60 seconds ago)
        `);
        return;
      }

      await this.processTimerEvent({
        startTimestamp,
        endTimestamp,
      });
    }

    // Webhook event
    else {
      if (!this._isValidSource(event)) {
        this.http.respond({
          statusCode: 404,
        });
        console.log("Skipping event from unrecognized source");
        return;
      }

      this.http.respond({
        statusCode: 200,
      });

      await this.processWebhookEvent(event);
    }
  },
};
