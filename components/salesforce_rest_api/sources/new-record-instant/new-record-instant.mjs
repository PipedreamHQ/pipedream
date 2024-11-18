import startCase from "lodash/startCase.js";
import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-new-record-instant",
  description: "Emit new event when a record of the selected object type is created. [See the documentation](https://sforce.co/3yPSJZy)",
  version: "0.2.0",
  props: {
    ...common.props,
    fieldsToObtain: {
      propDefinition: [
        common.props.salesforce,
        "fieldsToObtain",
        (c) => ({
          objType: c.objectType,
        }),
      ],
      optional: true,
      description: "Select the field(s) to be retrieved for the records. Only applicable if the source is running on a timer. If running on a webhook, or if not specified, all fields will be retrieved.",
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      const objectType = this.objectType;
      const nameField = await this.salesforce.getNameFieldForObjectType(objectType);
      this.setNameField(nameField);

      // emit historical events
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
        this.processWebhookEvent(event);
      }
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
      const { New: newObject } = data.body;
      const {
        CreatedDate: createdDate,
        Id: id,
        [nameField]: name,
      } = newObject;
      const entityType = startCase(this.objectType).toLowerCase();
      const summary = `New ${entityType} created: ${name ?? id}`;
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
        objectType,
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
        objectType,
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
        objectType,
        getObjectTypeDescription,
        setObjectTypeColumns,
      } = this;

      let columns = this.fieldsToObtain;
      if (!columns?.length) {
        const { fields } = await getObjectTypeDescription(objectType);
        columns = fields.map(({ name }) => name);
      }

      setObjectTypeColumns(columns);
    },
  },
};
