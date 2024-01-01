import startCase from "lodash/startCase.js";
import common from "../common.mjs";
import constants from "../../common/constants.mjs";

export default {
  ...common,
  type: "source",
  name: "New Updated Object (of Selectable Type)",
  key: "salesforce_rest_api-object-updated",
  description: "Emit new event (at regular intervals) when an object of arbitrary type (selected as an input parameter by the user) is updated. [See the docs](https://sforce.co/3yPSJZy) for more information.",
  version: "0.1.9",
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
    generateMeta(item, fieldName) {
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
    async processEvent(eventData) {
      const {
        getNameField,
        getObjectTypeColumns,
        paginate,
        objectType,
        setLatestDateCovered,
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
        dateFieldName: constants.FIELD_NAME.LAST_MODIFIED_DATE,
      });

      const [
        latestEvent,
      ] = events;

      if (latestEvent?.LastModifiedDate) {
        setLatestDateCovered((new Date(latestEvent.LastModifiedDate)).toISOString());
      }

      Array.from(events)
        .reverse()
        .forEach((item) => {
          const meta = generateMeta(item, fieldName);
          emit(item, meta);
        });
    },
  },
};
