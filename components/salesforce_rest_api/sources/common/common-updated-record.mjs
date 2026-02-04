import startCase from "lodash/startCase.js";
import common from "../common/common.mjs";
import constants from "../../common/constants.mjs";
import { v4 as uuidv4 } from "uuid";

export default {
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      const objectType = this.getObjectType();
      const nameField = await this.salesforce.getNameFieldForObjectType(objectType);
      this.setNameField(nameField);

      if (!this.skipFirstRun) {
        const { recentItems } = await this.salesforce.listSObjectTypeIds(objectType);
        const ids = recentItems.map((item) => item.Id);

        for (const id of ids.slice(-25)) {
          const object = await this.salesforce.getSObject(objectType, id);

          const event = {
            body: {
              "New": object,
              "UserId": id,
            },
          };
          const meta = this.generateWebhookMeta(event);
          this.$emit(event.body, meta);
        }
      }
    },
    async activate() {
      // Attempt to create the webhook
      const secretToken = uuidv4();
      let webhookData;
      const objectType = this.getObjectType();
      try {
        webhookData = await this.createWebhook({
          endpointUrl: this.http.endpoint,
          sObjectType: objectType,
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

      const nameField = await this.salesforce.getNameFieldForObjectType(objectType);
      this.setNameField(nameField);
    },
  },
  methods: {
    ...common.methods,
    getHistoryObjectName(objectType) {
      if (objectType.endsWith("__c")) {
        return objectType.replace(/__c$/, "__History");
      }
      return `${objectType}History`;
    },
    getHistoryParentIdField(objectType) {
      if (objectType.endsWith("__c")) {
        return "ParentId";
      }
      return `${objectType}Id`;
    },
    async queryFieldHistory({
      objectType, recordIds, fields, startTimestamp,
    }) {
      if (!recordIds?.length || !fields?.length) {
        return new Set();
      }

      const historyObjectName = this.getHistoryObjectName(objectType);
      const parentIdField = this.getHistoryParentIdField(objectType);
      const fieldList = fields.map((f) => `'${f}'`).join(", ");

      const BATCH_SIZE = 200;
      const recordsWithChanges = new Set();
      let totalHistoryRecords = 0;

      for (let i = 0; i < recordIds.length; i += BATCH_SIZE) {
        const batch = recordIds.slice(i, i + BATCH_SIZE);
        const recordIdList = batch.map((id) => `'${id}'`).join(", ");

        const query = `
          SELECT ${parentIdField}, Field, OldValue, NewValue, CreatedDate
          FROM ${historyObjectName}
          WHERE ${parentIdField} IN (${recordIdList})
            AND Field IN (${fieldList})
            AND CreatedDate >= ${startTimestamp}
          ORDER BY CreatedDate DESC
        `;

        try {
          const { records } = await this.query({
            query,
          });

          totalHistoryRecords += records.length;
          for (const record of records) {
            recordsWithChanges.add(record[parentIdField]);
          }
        } catch (err) {
          console.log(`Field history query failed for ${historyObjectName}: ${err.message}`);
          console.log("This usually means field history tracking is not enabled for this object or the selected fields.");
          console.log("To enable field history tracking in Salesforce:");
          console.log("1. Go to Setup → Object Manager → [Your Object] → Fields & Relationships");
          console.log("2. Click 'Set History Tracking' and select the fields you want to track");
          console.log("Falling back to emitting all updated records without field filtering.");
          return null;
        }
      }

      console.log(`Field history query found ${totalHistoryRecords} change(s) for ${recordsWithChanges.size} record(s)`);
      return recordsWithChanges;
    },
    generateWebhookMeta(data) {
      const nameField = this.getNameField();
      const { New: newObject } = data.body;
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        [nameField]: name,
      } = newObject;
      const summary = `${this.getObjectType()} updated: ${name}`;
      const ts = Date.parse(lastModifiedDate);
      const compositeId = `${id}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    generateTimerMeta(item, fieldName) {
      const {
        LastModifiedDate: lastModifiedDate,
        [fieldName]: name,
        Id: id,
      } = item;

      const entityType = startCase(this.getObjectType());
      const summary = `${entityType} updated: ${name}`;
      const ts = Date.parse(lastModifiedDate);
      return {
        id: `${id}-${ts}`,
        summary,
        ts,
      };
    },
    getEventType() {
      return "updated";
    },
    isEventRelevant(changedFields) {
      const { fields } = this;
      return fields?.length
        ? Object.keys(changedFields).some((key) => fields.includes(key))
        : true;
    },
    getChangedFields(body) {
      return Object.entries(body.New).filter(([
        key,
        value,
      ]) => {
        const oldValue = body.Old[key];
        return (
          value !== undefined
          && JSON.stringify(value) !== JSON.stringify(oldValue)
        );
      })
        .reduce((obj, [
          key,
          value,
        ]) => {
          obj[key] = {
            old: body.Old[key],
            new: value,
          };
          return obj;
        }, {});
    },
    processWebhookEvent(event) {
      const { body } = event;
      const changedFields = this.getChangedFields(body);
      if (this.isEventRelevant(changedFields)) {
        const meta = this.generateWebhookMeta(event);
        this.$emit({
          ...body,
          changedFields,
        }, meta);
      }
    },
    async processTimerEvent(eventData) {
      const {
        getNameField,
        getObjectTypeColumns,
        paginate,
        setLatestDateCovered,
        generateTimerMeta,
        $emit: emit,
      } = this;

      const {
        startTimestamp,
        endTimestamp,
      } = eventData;

      const fieldName = getNameField();
      const columns = getObjectTypeColumns();
      const objectType = this.getObjectType();

      const events = await paginate({
        objectType,
        startTimestamp,
        endTimestamp,
        columns,
        dateFieldName: constants.FIELD_NAME.LAST_MODIFIED_DATE,
      });

      const [
        latestEvent,
      ] = events;

      let latestDateCovered = new Date(latestEvent?.LastModifiedDate || endTimestamp);
      if (isNaN(latestDateCovered.getMilliseconds())) {
        latestDateCovered = new Date();
      }
      latestDateCovered.setSeconds(0);
      setLatestDateCovered(latestDateCovered.toISOString());

      const { fields } = this;

      if (!fields?.length) {
        Array.from(events)
          .reverse()
          .forEach((item) => {
            const meta = generateTimerMeta(item, fieldName);
            emit(item, meta);
          });
        return;
      }

      const recordIds = events.map((event) => event.Id);
      const recordsWithFieldChanges = await this.queryFieldHistory({
        objectType,
        recordIds,
        fields,
        startTimestamp,
      });

      if (recordsWithFieldChanges === null) {
        console.log("Emitting all updated records due to field history unavailability");
        Array.from(events)
          .reverse()
          .forEach((item) => {
            const meta = generateTimerMeta(item, fieldName);
            emit(item, meta);
          });
        return;
      }

      const filteredEvents = events.filter((item) => recordsWithFieldChanges.has(item.Id));

      console.log(`Filtered ${events.length} updated records to ${filteredEvents.length} with watched field changes`);

      Array.from(filteredEvents)
        .reverse()
        .forEach((item) => {
          const meta = generateTimerMeta(item, fieldName);
          emit(item, meta);
        });
    },
    async timerActivateHook() {
      const {
        getObjectTypeDescription,
        setObjectTypeColumns,
      } = this;

      const { fields } = await getObjectTypeDescription(this.getObjectType());
      const columns = fields.map(({ name }) => name);

      setObjectTypeColumns(columns);
    },
  },
};
