import startCase from "lodash/startCase.js";
import { v4 as uuidv4 } from "uuid";
import common from "../common/common.mjs";

export default {
  ...common,
  hooks: {
    ...common.hooks,
    async deploy() {
      const objectType = this.getObjectType();
      const nameField = await this.salesforce.getNameFieldForObjectType(objectType);
      this.setNameField(nameField);

      // emit historical events
      const { recentItems } = await this.salesforce.listSObjectTypeIds(objectType);
      const ids = recentItems.map((item) => item.Id);
      for (const id of ids.slice(-25)) {
        const body = await this.salesforce.getSObject(objectType, id);
        this.processWebhookEvent({
          body,
        });
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
    generateTimerMeta(item, fieldName) {
      const { objectType } = this;
      const {
        CreatedDate: createdDate,
        [fieldName]: name,
        Id: id,
      } = item;
      const entityType = startCase(objectType);
      const summary = `New ${entityType} created: ${name ?? id}`;
      const ts = Date.parse(createdDate);
      return {
        id,
        summary,
        ts,
      };
    },
    generateWebhookMeta(data) {
      const nameField = this.getNameField();
      const {
        CreatedDate: createdDate,
        Id: id,
        [nameField]: name,
      } = data.body;
      const summary = `New ${this.getObjectType()} created: ${name ?? id}`;
      const ts = Date.parse(createdDate);
      return {
        id,
        summary,
        ts,
      };
    },
    getEventType() {
      return "new";
    },
    async processTimerEvent(eventData) {
      const {
        paginate,
        setLatestDateCovered,
        getObjectTypeColumns,
        getNameField,
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
      });

      const [
        latestEvent,
      ] = events;

      if (latestEvent?.CreatedDate) {
        const latestDateCovered = new Date(latestEvent.CreatedDate);
        latestDateCovered.setSeconds(0);
        setLatestDateCovered(latestDateCovered.toISOString());
      }

      Array.from(events)
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

      let columns = this.fieldsToObtain;
      if (!columns?.length) {
        const { fields } = await getObjectTypeDescription(this.getObjectType());
        columns = fields.map(({ name }) => name);
      }

      setObjectTypeColumns(columns);
    },
  },
};
