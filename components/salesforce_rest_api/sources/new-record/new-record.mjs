import startCase from "lodash/startCase.js";

import common from "../common.mjs";

export default {
  ...common,
  type: "source",
  name: "New Record (of Selectable Type)",
  key: "salesforce_rest_api-new-record",
  description: "Emit new event (at regular intervals) when a record of arbitrary object type (selected as an input parameter by the user) is created. See [the docs](https://sforce.co/3yPSJZy) for more information.",
  version: "0.0.1",
  methods: {
    ...common.methods,
    isItemRelevant(item, startTimestamp, endTimestamp) {
      if (!item) {
        return false;
      }
      const startDate = Date.parse(startTimestamp);
      const endDate = Date.parse(endTimestamp);
      const createdDate = Date.parse(item.CreatedDate);
      return startDate <= createdDate && endDate >= createdDate;
    },
    generateMeta(item) {
      const nameField = this.getNameField();
      const {
        CreatedDate: createdDate,
        Id: id,
        [nameField]: name,
      } = item;
      const entityType = startCase(this.objectType);
      const summary = `New ${entityType} created: ${name}`;
      const ts = Date.parse(createdDate);
      return {
        id,
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
        .filter(({
          statusCode, result: item,
        }) =>
          statusCode === 200
          && this.isItemRelevant(item, startTimestamp, endTimestamp))
        .forEach(({ result: item }) => {
          const meta = this.generateMeta(item);
          this.$emit(item, meta);
        });
    },
  },
};
