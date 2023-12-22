import startCase from "lodash/startCase.js";

import common from "../common.mjs";

export default {
  ...common,
  dedupe: "greatest",
  type: "source",
  name: "New Record (of Selectable Type)",
  key: "salesforce_rest_api-new-record",
  description: "Emit new event (at regular intervals) when a record of arbitrary object type (selected as an input parameter by the user) is created. See [the docs](https://sforce.co/3yPSJZy) for more information.",
  version: "0.0.4",
  hooks: {
    ...common.hooks,
    async activate() {
      const {
        objectType,
        getObjectTypeDescription,
        setObjectTypeColumns,
      } = this;

      await common.hooks.activate.call(this);

      const { fields } = await getObjectTypeDescription(objectType);
      const columns = fields.map(({ name }) => name);

      setObjectTypeColumns(columns);
    },
  },
  methods: {
    ...common.methods,
    isRelevant(item, startTimestamp, endTimestamp) {
      if (!item) {
        return false;
      }
      const startDate = Date.parse(startTimestamp);
      const endDate = Date.parse(endTimestamp);
      const createdDate = Date.parse(item.CreatedDate);
      return startDate <= createdDate && endDate >= createdDate;
    },
    generateMeta(item, fieldName) {
      const { objectType } = this;
      const {
        CreatedDate: createdDate,
        [fieldName]: name,
      } = item;
      const entityType = startCase(objectType);
      const summary = `New ${entityType} created: ${name}`;
      const ts = Date.parse(createdDate);
      return {
        id: ts,
        summary,
        ts,
      };
    },
    async processEvent(eventData) {
      const {
        paginate,
        objectType,
        setLatestDateCovered,
        getObjectTypeColumns,
        isRelevant,
        getNameField,
        generateMeta,
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
        setLatestDateCovered((new Date(latestEvent.CreatedDate)).toISOString());
      }

      Array.from(events)
        .reverse()
        .filter((event) => isRelevant(event, startTimestamp, endTimestamp))
        .forEach((item) => {
          const meta = generateMeta(item, fieldName);
          emit(item, meta);
        });
    },
  },
};
