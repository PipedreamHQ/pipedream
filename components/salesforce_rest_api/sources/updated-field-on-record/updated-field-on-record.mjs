import startCase from "lodash/startCase.js";

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
  type: "source",
  name: "New Updated Field on Record (of Selectable Type)",
  key: "salesforce_rest_api-updated-field-on-record",
  description: "Emit new event (at regular intervals) when a field of your choosing is updated on any record of a specified Salesforce object. Field history tracking must be enabled for the chosen field. See the docs on [field history tracking](https://sforce.co/3mtj0rF) and [history objects](https://sforce.co/3Fn4lWB) for more information.",
  version: "0.1.1",
  props: {
    ...common.props,
    objectType: {
      ...common.props.objectType,
      label: common.props.objectType.label,
      description: common.props.objectType.description,
      async options(context) {
        const { page } = context;
        if (page !== 0) {
          return {
            options: [],
          };
        }

        const { sobjects } = await this.salesforce.listSObjectTypes();
        // Filter options to include only sObjects with associated
        // [history](https://sforce.co/3Fn4lWB) objects
        const options = sobjects
          .filter(this.isValidSObject)
          .map((sobject) => ({
            label: sobjects.find((o) => o.name === sobject.associateParentEntity).label,
            value: sobject.associateParentEntity,
          }));
        return {
          options,
        };
      },
    },
    field: {
      propDefinition: [
        salesforce,
        "field",
        ({ objectType }) => ({
          objectType,
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
      await common.hooks.activate.call(this);
      const historyObject = await this.salesforce.getHistorySObjectForObjectType(this.objectType);
      if (!historyObject) {
        throw new Error(`History object not found for "${this.objectType}"`);
      }
      this._setHistoryObjectType(historyObject.name);
    },
  },
  methods: {
    ...common.methods,
    _getHistoryObjectType() {
      return this.db.get("historyObjectType");
    },
    _setHistoryObjectType(historyObjectType) {
      this.db.set("historyObjectType", historyObjectType);
    },
    _getParentId(item) {
      const parentIdKey = `${this.objectType}Id`;
      return item[parentIdKey] ?? item["ParentId"];
    },
    isValidSObject(sobject) {
      // Only the activity of those SObject types that have the `replicateable`
      // flag set is published via the `getUpdated` API.
      //
      // See the API docs here: https://sforce.co/3gDy3uP
      return sobject.replicateable && this.salesforce.isHistorySObject(sobject);
    },
    isRelevant(item) {
      const isFieldRelevant = item.Field === this.field;
      const isFieldValueRelevant = !this.fieldUpdatedTo || item.NewValue === this.fieldUpdatedTo;
      return isFieldRelevant && isFieldValueRelevant;
    },
    generateMeta(event) {
      const nameField = this.getNameField();
      const {
        record: item = {},
        update,
      } = event;
      const { [nameField]: name } = item;
      const {
        Id: id,
        CreatedDate: createdDate,
      } = update;
      const entityType = startCase(this.objectType);
      const summary = `${this.field} on ${entityType}: ${name}`;
      const ts = Date.parse(createdDate);
      const compositeId = `${id}-${ts}`;
      return {
        id: compositeId,
        summary,
        ts,
      };
    },
    async processEvent(eventData) {
      const {
        startTimestamp,
        endTimestamp,
      } = eventData;
      const historyObjectType = this._getHistoryObjectType();
      const {
        ids,
        latestDateCovered,
      } = await this.salesforce.getUpdatedForObjectType(
        historyObjectType,
        startTimestamp,
        endTimestamp,
      );
      this.setLatestDateCovered(latestDateCovered);

      // By the time we try to retrieve an item, it might've been deleted. This
      // will cause `getSObject` to throw a 404 exception, which will reject its
      // promise. Hence, we need to filter those items that are still in Salesforce
      // and exclude those that are not.
      const historyItemRetrievals = await Promise.allSettled(
        ids.map((id) => this.salesforce.getSObject(historyObjectType, id)),
      );
      const historyItems = historyItemRetrievals
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value)
        .filter(this.isRelevant);

      // To fetch associated sObject records only once, create a set of the "parent IDs" of the
      // history object records
      const parentIdSet = new Set(
        historyItems
          .map(this._getParentId)
          .filter((id) => id),
      );
      const parentIds = Array.from(parentIdSet);

      const itemRetrievals = await Promise.allSettled(
        parentIds.map((id) => this.salesforce.getSObject(this.objectType, id)),
      );
      const itemsById = itemRetrievals
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value)
        .reduce((acc, item) => {
          acc[item.Id] = item;
          return acc;
        }, {});

      const events = historyItems.map((item) => ({
        update: item,
        record: itemsById[this._getParentId(item)],
      }));

      events.forEach((event) => {
        const meta = this.generateMeta(event);
        this.$emit(event, meta);
      });
    },
  },
};
