import words from "lodash/words.js";
import common from "../common.mjs";

const { salesforce } = common.props;

/**
 * Uses the Salesforce REST API's [sObject Get Updated endpoint](https://sforce.co/3yPSJZy) on the
 * [StandardObjectNamedHistory model](https://sforce.co/3Fn4lWB) to get changes to field values of
 * an sObject type. Associated sObject records are retrieved and emitted for history object records
 * matching configured `field` and `fieldUpdatedTo` prop values.
 */
export default {
  ...common,
  dedupe: "greatest",
  type: "source",
  name: "New Updated Field on Record (of Selectable Type)",
  key: "salesforce_rest_api-updated-field-on-record",
  description: "Emit new event (at regular intervals) when a field of your choosing is updated on any record of a specified Salesforce object. Field history tracking must be enabled for the chosen field. See the docs on [field history tracking](https://sforce.co/3mtj0rF) and [history objects](https://sforce.co/3Fn4lWB) for more information.",
  version: "0.1.9",
  props: {
    ...common.props,
    objectType: {
      type: common.props.objectType.type,
      label: common.props.objectType.label,
      description: common.props.objectType.description,
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
  hooks: {
    ...common.hooks,
    async activate() {
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
  methods: {
    ...common.methods,
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
    generateMeta(event) {
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
    async processEvent({
      startTimestamp, endTimestamp,
    }) {
      const {
        getHistoryObjectType,
        getObjectTypeColumns,
        setLatestDateCovered,
        isRelevant,
        paginate,
        generateMeta,
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
        setLatestDateCovered((new Date(latestEvent.CreatedDate)).toISOString());
      }

      Array.from(events)
        .reverse()
        .filter(isRelevant)
        .forEach((event) => {
          const meta = generateMeta(event);
          emit(event, meta);
        });
    },
  },
};
