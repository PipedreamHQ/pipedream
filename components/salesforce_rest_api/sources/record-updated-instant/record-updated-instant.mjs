import startCase from "lodash/startCase.js";
import common from "../common.mjs";
import constants from "../../common/constants.mjs";
const { salesforce } = common.props;

export default {
  ...common,
  type: "source",
  name: "New Updated Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-record-updated-instant",
  description: "Emit new event when a record of the selected type is updated. [See the documentation](https://sforce.co/3yPSJZy)",
  version: "0.2.0",
  props: {
    ...common.props,
    fields: {
      propDefinition: [
        salesforce,
        "field",
        ({ objectType }) => ({
          objectType,
          filter: ({ updateable }) => updateable,
        }),
      ],
      label: "Fields To Watch",
      type: "string[]",
      optional: true,
      description: "If specified, events will only be emitted if at least one of the selected fields is updated. This filter is only available when a webhook is created successfully.",
    },
  },
  methods: {
    ...common.methods,
    generateWebhookMeta(data) {
      const nameField = this.getNameField();
      const { New: newObject } = data.body;
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        [nameField]: name,
      } = newObject;
      const entityType = startCase(this.objectType);
      const summary = `${entityType} updated: ${name}`;
      const ts = Date.parse(lastModifiedDate);
      const compositeId = `${id}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    generateTimerMeta(item, fieldName) {
      const { objectType } = this;

      const {
        LastModifiedDate: lastModifiedDate,
        [fieldName]: name,
        Id: id,
      } = item;

      const entityType = startCase(objectType);
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
          && oldValue !== undefined
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
        objectType,
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
        objectType,
        startTimestamp,
        endTimestamp,
        columns,
        dateFieldName: constants.FIELD_NAME.LAST_MODIFIED_DATE,
      });

      const [
        latestEvent,
      ] = events;

      if (latestEvent?.LastModifiedDate) {
        const latestDateCovered = new Date(latestEvent.LastModifiedDate);
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

      const { fields } = await getObjectTypeDescription(objectType);
      const columns = fields.map(({ name }) => name);

      setObjectTypeColumns(columns);
    },
  },
};
