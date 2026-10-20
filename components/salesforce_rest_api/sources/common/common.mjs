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
    getLatestIdCovered() {
      return this.db.get("latestIdCovered");
    },
    setLatestIdCovered(latestIdCovered) {
      this.db.set("latestIdCovered", latestIdCovered);
    },
    // Advances the polling cursor to the last emitted record. Records are paged in
    // ascending (date, Id) order, so the next tick resumes right after it.
    setPollingCursor(records, dateFieldName) {
      const lastRecord = records[records.length - 1];
      const lastDate = new Date(lastRecord?.[dateFieldName]);
      if (!lastRecord?.Id || isNaN(lastDate.getTime())) {
        return;
      }
      this.setLatestDateCovered(lastDate.toISOString());
      this.setLatestIdCovered(lastRecord.Id);
    },
    getNameField() {
      // Cache in memory for the lifetime of this execution. The deploy hook emits
      // up to DEPLOY_HISTORICAL_LIMIT historical events, each building meta via
      // getNameField(); without this the db is read once per event (e.g. 25x).
      if (this._nameField === undefined) {
        this._nameField = this.db.get("nameField");
      }
      return this._nameField;
    },
    setNameField(nameField) {
      // Keep the in-memory cache coherent with the persisted value so a read after
      // a write doesn't fall back to db.get.
      this._nameField = nameField;
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
      startTimestamp, startId, endTimestamp,
      dateFieldName = constants.FIELD_NAME.CREATED_DATE,
      extraConditions = "",
      limit = constants.POLLING_PAGE_SIZE, ...args
    } = {}) {
      // The cursor fields must always be selected, whatever columns the user picked
      const selectedColumns = [
        ...new Set([
          "Id",
          dateFieldName,
          ...columns,
        ]),
      ];
      // Records sharing the cursor's timestamp are told apart by Id, so a page
      // boundary that splits them neither skips nor repeats any
      const afterCursor = startId
        ? `(${dateFieldName} > ${startTimestamp} OR (${dateFieldName} = ${startTimestamp} AND Id > '${startId}'))`
        : `${dateFieldName} > ${startTimestamp}`;
      return this.query({
        query: `
          SELECT ${selectedColumns.join(", ")}
            FROM ${objectType}
              WHERE ${afterCursor}
              AND ${dateFieldName} <= ${endTimestamp}
              ${extraConditions}
              ORDER BY ${dateFieldName} ASC, Id ASC
              LIMIT ${limit}
        `,
        ...args,
      });
    },
    async paginate({
      startTimestamp, startId,
      dateFieldName = constants.FIELD_NAME.CREATED_DATE,
      limit = constants.POLLING_PAGE_SIZE,
      maxRecords = constants.POLLING_MAX_RECORDS,
      ...args
    } = {}) {
      const records = [];
      let nextRecords = [];
      let cursor = {
        startTimestamp,
        startId,
      };

      do {
        try {
          ({ records: nextRecords } = await this.queryObjects({
            ...args,
            ...cursor,
            dateFieldName,
            limit,
          }));
        } catch (err) {
          // Keep the pages already fetched so the caller can emit them and move
          // the cursor forward; the next tick resumes from there
          if (!records.length) {
            throw err;
          }
          console.log(`Error fetching the next page after ${records.length} record(s), resuming on the next run:`, err);
          break;
        }

        records.push(...nextRecords);

        const lastRecord = nextRecords[nextRecords.length - 1];
        if (lastRecord) {
          cursor = {
            startTimestamp: new Date(lastRecord[dateFieldName]).toISOString(),
            startId: lastRecord.Id,
          };
        }
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
        startId: this.getLatestIdCovered(),
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
