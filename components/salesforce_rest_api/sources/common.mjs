import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import salesforce from "../salesforce_rest_api.app.mjs";

export default {
  dedupe: "unique",
  props: {
    salesforce,
    db: "$.service.db",
    // eslint-disable-next-line pipedream/props-label,pipedream/props-description
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    objectType: {
      type: "string",
      label: "Object Type",
      description: "The type of object for which to monitor events",
      propDefinition: [
        salesforce,
        "objectType",
      ],
    },
  },
  hooks: {
    async activate() {
      const latestDateCovered = this.getLatestDateCovered();
      if (!latestDateCovered) {
        const now = new Date().toISOString();
        this.setLatestDateCovered(now);
      }

      const nameField = await this.salesforce.getNameFieldForObjectType(this.objectType);
      this.setNameField(nameField);
    },
  },
  methods: {
    getLatestDateCovered() {
      return this.db.get("latestDateCovered");
    },
    setLatestDateCovered(latestDateCovered) {
      this.db.set("latestDateCovered", latestDateCovered);
    },
    getNameField() {
      return this.db.get("nameField");
    },
    setNameField(nameField) {
      this.db.set("nameField", nameField);
    },
    processEvent() {
      throw new Error("processEvent is not implemented");
    },
    chunkArray(array, chunkSize = 25) {
      return array.reduce((chunks, item, index) => {
        const chunkIndex = Math.floor(index / chunkSize);

        if (!chunks[chunkIndex]) {
          chunks[chunkIndex] = [];
        }

        chunks[chunkIndex].push(item);

        return chunks;
      }, []);
    },
    getRelativeObjectUrl(id, historyObjectType) {
      const {
        salesforce,
        objectType,
      } = this;
      return `/services/data/v${salesforce._apiVersion()}/sobjects/${historyObjectType || objectType}/${id}`;
    },
    getBatchRequests(ids, historyObjectType) {
      return ids.map((id) => ({
        method: "GET",
        url: this.getRelativeObjectUrl(id, historyObjectType),
      }));
    },
    batchRequest(args = {}) {
      const { salesforce } = this;
      return salesforce._makeRequest({
        debug: true,
        method: "POST",
        url: `${salesforce._baseApiVersionUrl()}/composite/batch`,
        ...args,
      });
    },
    makeChunkBatchRequests({
      ids, objectType, ...args
    } = {}) {
      const {
        batchRequest,
        chunkArray,
      } = this;

      const chunks = chunkArray(ids);
      const promises = chunks.map((ids) => batchRequest({
        data: {
          batchRequests: this.getBatchRequests(ids, objectType),
          ...args?.data,
        },
        ...args,
      }));
      return Promise.all(promises);
    },
    getChunkBatchResults(responses) {
      return responses.reduce((acc, { results }) => [
        ...acc,
        ...results,
      ], []);
    },
    async makeChunkBatchRequestsAndGetResults(args) {
      const {
        makeChunkBatchRequests,
        getChunkBatchResults,
      } = this;
      const responses = await makeChunkBatchRequests(args);
      return getChunkBatchResults(responses);
    },
  },
  async run(event) {
    const startTimestamp = this.getLatestDateCovered();
    const endTimestamp = new Date(event.timestamp * 1000).toISOString();
    const timeDiffSec = Math.floor(
      (Date.parse(endTimestamp) - Date.parse(startTimestamp)) / 1000,
    );
    if (timeDiffSec < 60) {
      console.log(`
        Skipping execution since the last one happened approximately ${timeDiffSec} seconds ago
      `);
      return;
    }

    await this.processEvent({
      startTimestamp,
      endTimestamp,
    });
  },
};
