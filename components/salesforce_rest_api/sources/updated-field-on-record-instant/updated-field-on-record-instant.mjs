import startCase from "lodash/startCase.js";
import common from "../common.mjs";
import words from "lodash/words.js";
const { salesforce } = common.props;

/**
 * The timer part uses the Salesforce REST API's [sObject Get Updated endpoint](https://sforce.co/3yPSJZy) on the
 * [StandardObjectNamedHistory model](https://sforce.co/3Fn4lWB) to get changes to field values of
 * an sObject type. Associated sObject records are retrieved and emitted for history object records
 * matching configured `field` and `fieldUpdatedTo` prop values.
 */

export default {
  ...common,
  type: "source",
  name: "New Updated Field on Record (Instant, of Selectable Type)",
  key: "salesforce_rest_api-updated-field-on-record-instant",
  description: "Emit new event when the selected field is updated on any record of the selected Salesforce object. See the documentation on [field history tracking](https://sforce.co/3mtj0rF) and [history objects](https://sforce.co/3Fn4lWB)",
  version: "0.1.{{ts}}",
  props: {
    ...common.props,
    objectType: {
      ...common.props.objectType,
      propDefinition: [
        salesforce,
        "objectType",
        () => ({
          filter: ({
            replicateable,
            associateEntityType,
          }) => replicateable && associateEntityType === "History",
          mapper: ({ associateParentEntity: value }) => words(value).join(" "),
        }),
      ],
    },
    field: {
      propDefinition: [
        salesforce,
        "field",
        ({ objectType }) => ({
          objectType,
          filter: ({ updateable }) => updateable,
        }),
      ],
    },
    fieldUpdatedTo: {
      propDefinition: [
        salesforce,
        "fieldUpdatedTo",
      ],
    },
  },
  methods: {
    ...common.methods,
    isEventRelevant(event) {
      if (!this.fieldUpdatedTo) {
        return true;
      }
      const { New: newObject } = event.body;
      const { [this.field]: newFieldValue } = newObject;
      return !this.fieldUpdatedTo || this.fieldUpdatedTo === newFieldValue;
    },
    generateWebhookMeta(data) {
      const nameField = this.getNameField();
      const { New: newObject } = data.body;
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        [nameField]: name,
      } = newObject;
      const entityType = startCase(this.objectType);
      const summary = `${this.field} on ${entityType}: ${name}`;
      const ts = Date.parse(lastModifiedDate);
      const compositeId = `${id}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    generateTimerMeta(event) {
      const {
        objectType,
        field,
      } = this;

      const {
        CreatedDate: createdDate,
        Id: id,
        [`${objectType}Id`]: objectId,
      } = event;

      const ts = Date.parse(createdDate);
      return {
        id: `${id}-${ts}`,
        summary: `${field} on ${objectType}: ${objectId}`,
        ts,
      };
    },
    processWebhookEvent(event) {
      const { body } = event;
      if (!this.isEventRelevant(event)) {
        return;
      }
      const meta = this.generateWebhookMeta(event);
      this.$emit(body, meta);
    },
    getEventType() {
      return "updated";
    },
    getFieldsToCheck() {
      return [
        this.field,
      ];
    },
    async processTimerEvent({
      startTimestamp, endTimestamp,
    }) {
      const {
        getHistoryObjectType,
        getObjectTypeColumns,
        setLatestDateCovered,
        isRelevant,
        paginate,
        generateTimerMeta,
        $emit: emit,
      } = this;

      const objectType = getHistoryObjectType();
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
        .filter(isRelevant)
        .forEach((event) => {
          const meta = generateTimerMeta(event);
          emit(event, meta);
        });
    },
    getHistoryObjectType() {
      return this.db.get("historyObjectType");
    },
    setHistoryObjectType(historyObjectType) {
      this.db.set("historyObjectType", historyObjectType);
    },
    isRelevant(item) {
      const {
        field,
        fieldUpdatedTo,
      } = this;

      const isFieldRelevant =
        item.Field === field
        || item.Field === `${item.DataType}${field}`;

      const isFieldValueRelevant =
        !fieldUpdatedTo
        || item.NewValue === fieldUpdatedTo;

      return isFieldRelevant && isFieldValueRelevant;
    },
    async timerActivateHook() {
      const {
        objectType,
        getObjectTypeDescription,
        setHistoryObjectType,
        setObjectTypeColumns,
      } = this;

      await common.hooks.activate.call(this);

      const historyObjectType = `${objectType}History`;

      const { fields } = await getObjectTypeDescription(historyObjectType);
      const columns = fields.map(({ name }) => name);

      setHistoryObjectType(historyObjectType);
      setObjectTypeColumns(columns);
    },
  },
};
