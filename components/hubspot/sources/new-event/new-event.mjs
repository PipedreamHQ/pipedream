import { ConfigurationError } from "@pipedream/platform";
import { DEFAULT_LIMIT } from "../../common/constants.mjs";
import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "hubspot-new-event",
  name: "New Events",
  description: "Emit new event for each new Hubspot event. Note: Only available for Marketing Hub Enterprise, Sales Hub Enterprise, Service Hub Enterprise, or CMS Hub Enterprise accounts",
  version: "0.0.37",
  dedupe: "unique",
  type: "source",
  props: {
    ...common.props,
    objectType: {
      propDefinition: [
        common.props.hubspot,
        "objectType",
      ],
    },
    objectIds: {
      propDefinition: [
        common.props.hubspot,
        "objectIds",
        (c) => ({
          objectType: c.objectType,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      try {
        await this.hubspot.getEvents({
          params: {
            objectType: this.objectType,
            objectId: this.objectIds[0],
          },
        });
      } catch {
        throw new ConfigurationError(
          "Error occurred. Please verify that your Hubspot account is one of: Marketing Hub Enterprise, Sales Hub Enterprise, Service Hub Enterprise, or CMS Hub Enterprise",
        );
      }
    },
  },
  methods: {
    ...common.methods,
    getTs() {
      return Date.now();
    },
    generateMeta(result) {
      const {
        id, eventType,
      } = result;
      return {
        id,
        summary: eventType,
        ts: this.getTs(),
      };
    },
    getParams() {
      return null;
    },
    getEventParams(objectId, occurredAfter) {
      return {
        params: {
          limit: DEFAULT_LIMIT,
          objectType: this.objectType,
          objectId,
          occurredAfter,
        },
      };
    },
    async processResults(after) {
      for (const objectId of this.objectIds) {
        const params = this.getEventParams(objectId, after);
        await this.paginate(
          params,
          this.hubspot.getEvents.bind(this),
          "results",
          after,
        );
      }
    },
  },
  sampleEmit,
};
