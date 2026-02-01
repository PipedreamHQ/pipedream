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
        const { fields } = this;
        const fieldValuesToStore = {};

        for (const id of ids.slice(-25)) {
          const object = await this.salesforce.getSObject(objectType, id);

          if (fields?.length) {
            fieldValuesToStore[id] = {};
            for (const field of fields) {
              fieldValuesToStore[id][field] = object[field];
            }
          }

          const event = {
            body: {
              "New": object,
              "UserId": id,
            },
          };
          const meta = this.generateWebhookMeta(event);
          this.$emit(event.body, meta);
        }

        if (fields?.length && Object.keys(fieldValuesToStore).length > 0) {
          this._setPreviousFieldValues(fieldValuesToStore);
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
    _getPreviousFieldValues() {
      return this.db.get("previousFieldValues") || {};
    },
    _setPreviousFieldValues(values) {
      this.db.set("previousFieldValues", values);
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

      const events = await paginate({
        objectType: this.getObjectType(),
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

      const previousFieldValues = this._getPreviousFieldValues();
      const newFieldValues = {};

      const filteredEvents = events.filter((item) => {
        const recordId = item.Id;
        const prevValues = previousFieldValues[recordId];

        newFieldValues[recordId] = {};
        for (const field of fields) {
          newFieldValues[recordId][field] = item[field];
        }

        if (!prevValues) {
          return false;
        }

        const hasChange = fields.some((field) => {
          const currentValue = item[field];
          const previousValue = prevValues[field];
          return JSON.stringify(currentValue) !== JSON.stringify(previousValue);
        });

        return hasChange;
      });

      this._setPreviousFieldValues({
        ...previousFieldValues,
        ...newFieldValues,
      });

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
