import startCase from "lodash/startCase.js";

import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Updated Object (of Selectable Type)",
  key: "salesforce_rest_api-object-updated",
  description: "Emit new event (at regular intervals) when an object of arbitrary type (selected as an input parameter by the user) is updated. [See the docs](https://sforce.co/3yPSJZy) for more information.",
  version: "0.1.6",
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
        startTimestamp,
        endTimestamp,
      } = eventData;
      const {
        ids,
        latestDateCovered,
      } = await this.salesforce.getUpdatedForObjectType(
        this.objectType,
        startTimestamp,
        endTimestamp,
      );
      this.setLatestDateCovered(latestDateCovered);

      if (!ids?.length) {
        return console.log("No batch requests to send");
      }

      const { results } = await this.batchRequest({
        data: {
          batchRequests: this.getBatchRequests(ids),
        },
      });

      results
        .filter(({ statusCode }) => statusCode === 200)
        .forEach(({ result: item }) => {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
        });
    },
  },
};
