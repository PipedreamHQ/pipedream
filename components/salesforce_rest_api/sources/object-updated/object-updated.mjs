import startCase from "lodash/startCase.js";

import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Updated Object (of Selectable Type)",
  key: "salesforce_rest_api-object-updated",
  description: "Emit new event (at regular intervals) when an object of arbitrary type (selected as an input parameter by the user) is updated. [See the docs](https://sforce.co/3yPSJZy) for more information.",
  version: "0.1.8",
  methods: {
    ...common.methods,
    generateMeta(item) {
      const nameField = this.getNameField();
      const {
        LastModifiedDate: lastModifiedDate,
        Id: id,
        [nameField]: name,
      } = item;
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
    async processEvent(eventData) {
      const {
        salesforce,
        objectType,
        setLatestDateCovered,
        makeChunkBatchRequestsAndGetResults,
        generateMeta,
        $emit: emit,
      } = this;

      const {
        startTimestamp,
        endTimestamp,
      } = eventData;

      const {
        ids,
        latestDateCovered,
      } = await salesforce.getUpdatedForObjectType(
        objectType,
        startTimestamp,
        endTimestamp,
      );
      setLatestDateCovered(latestDateCovered);

      if (!ids?.length) {
        return console.log("No batch requests to send");
      }

      const results = await makeChunkBatchRequestsAndGetResults({
        ids,
      });

      results
        .filter(({ statusCode }) => statusCode === 200)
        .forEach(({ result: item }) => {
          const meta = generateMeta(item);
          emit(item, meta);
        });
    },
  },
};
